import React, { useEffect, useState } from "react";
import { BookingFormData, CartItem, Cosmetic } from "../types/type";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../services/apiServices";
import { paymentSchema } from "../types/validationBooking";

type FormData = {
  proof: File | null;
  cosmetic_ids: { id: number; quantity: number }[];
};

export default function PaymentPage() {
  const [formData, setFormData] = useState<FormData>({
    proof: null,
    cosmetic_ids: [],
  });

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cosmeticDetails, setCosmeticDetails] = useState<Cosmetic[]>([]);
  const [formErrors, setFormErrors] = useState<z.ZodIssue[]>([]);
  const [BookingFormData, setBookingFormData] =
    useState<BookingFormData | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const navigate = useNavigate();
  const TAX_RATE = 0.11; // Assuming a tax rate of 11%

  const fetchCosmeticDetails = async (cartItems: CartItem[]) => {
    try {
      const fetchDetails = await Promise.all(
        cartItems.map(async (item) => {
          const response = await apiClient.get(`/cosmetic/${item.slug}`);
          return response.data.data;
        })
      );

      setCosmeticDetails(fetchDetails);
      setLoading(false);

      const cosmeticIdsWtihQuantities = cartItems.map((cartItem) => ({
        id: cartItem.cosmetic_id,
        quantity: cartItem.quantity,
      }));

      setFormData((prevData) => ({
        ...prevData,
        cosmetic_ids: cosmeticIdsWtihQuantities,
      }));
    } catch (error) {
      if (error instanceof Error) {
        console.log("Error fetching cosmetic details:", error.message);
        setError("Failed to fetch cosmetic details.");
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const cartData = localStorage.getItem("cart");
    const savedBookingFormData = localStorage.getItem("bookingData");
    if (savedBookingFormData) {
      setBookingFormData(JSON.parse(savedBookingFormData) as BookingFormData);
    }
    if (!cartData || (cartData && JSON.parse(cartData).length === 0)) {
      navigate("/");
      return;
    }
    const cartItems = JSON.parse(cartData) as CartItem[];
    setCartItems(cartItems);
    fetchCosmeticDetails(cartItems);
  }, [navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFormData((prevData) => ({
      ...prevData,
      proof: file,
    }));
  };

  const subtotal = cosmeticDetails.reduce((acc, cosmetic) => {
    const cartItem = cartItems.find((item) => item.cosmetic_id === cosmetic.id);
    return acc + (cartItem ? cosmetic.price * cartItem.quantity : 0);
  }, 0);

  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const tax = subtotal * TAX_RATE; // Assuming a tax rate of 11%
  const grandTotal = subtotal + tax;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg font-semibold text-red-500">{error}</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = paymentSchema.safeParse(formData);
    if (!validation.success) {
      setFormErrors(validation.error.issues);
      return;
    }
    setFormErrors([]);

    const submissionData = new FormData();
    if (formData.proof) {
      submissionData.append("proof", formData.proof);
    }

    if (BookingFormData) {
      submissionData.append("name", BookingFormData.name);
      submissionData.append("email", BookingFormData.email);
      submissionData.append("phone", BookingFormData.phone);
      submissionData.append("address", BookingFormData.address);
      submissionData.append("post_code", BookingFormData.post_code);
      submissionData.append("city", BookingFormData.city);
    }

    formData.cosmetic_ids.forEach((item, index) => {
      submissionData.append(`cosmetic_ids[${index}][id]`, String(item.id));
      submissionData.append(
        `cosmetic_ids[${index}][quantity]`,
        String(item.quantity)
      );
    });

    try {
      setLoading(true);
      const response = await apiClient.post(
        "/booking-transaction",
        submissionData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200 || response.status === 201) {
        console.log("Payment submitted successfully:", response.data.data);
        const bookingTrxId = response.data.data.booking_trx_id;

        if (!bookingTrxId) {
          console.error("Booking transaction ID is missing in the response.");
        }

        setSuccess("Payment submitted successfully!");

        localStorage.removeItem("cart");
        localStorage.removeItem("bookingFormData");
        setFormData({
          proof: null,
          cosmetic_ids: [],
        });
        setLoading(false);

        navigate(`/booking-finished?trx_id=${bookingTrxId}`);
      } else {
        console.error("Failed to submit payment:", response.status);

        setLoading(false);
      }
    } catch (error: unknown) {
      console.error("Error submitting payment:", error);
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: unknown }).response === "object" &&
        (error as { response?: { data?: unknown } }).response &&
        "data" in (error as { response?: { data?: unknown } }).response!
      ) {
        console.error(
          "Backend validation errors:",
          (error as { response: { data: unknown } }).response.data
        );
      }
      setLoading(false);
      setFormErrors([]);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-[640px] flex-col gap-5 bg-[#F6F6F8] pb-[30px]">
      <section id="NavTop">
        <div className="px-5">
          <div className="mt-5 flex w-full flex-col gap-5 rounded-3xl bg-white pb-[44px] pt-3">
            <div className="relative">
              <Link to={`/booking`}>
                <div className="absolute left-3 top-1/2 flex size-[44px] shrink-0 -translate-y-1/2 items-center justify-center rounded-full border border-cosmetics-greylight">
                  <img
                    src="/assets/images/icons/left.svg"
                    alt="icon"
                    className="size-5 shrink-0"
                  />
                </div>
              </Link>

              <div className="flex flex-col gap-[2px]">
                <h1 className="text-center text-lg font-bold leading-[27px]">
                  Payment
                </h1>
                <p className="text-center text-sm leading-[21px] text-cosmetics-grey">
                  We’ll give best treat
                </p>
              </div>
            </div>
            <div id="ProgressBar" className="relative px-5">
              <div className="flex">
                <div className="flex flex-col items-center">
                  <div className="relative z-10 flex h-[25px] items-center">
                    <div className="h-2 w-[60px] rounded-full bg-cosmetics-purple" />
                    <div className="absolute right-0 top-0 translate-x-1/2">
                      <div className="flex flex-col items-center gap-[6px]">
                        <div className="flex h-[25px] w-[25px] items-center justify-center rounded-full bg-cosmetics-purple text-xs font-bold leading-[18px] text-white">
                          1
                        </div>
                        <p className="text-xs font-semibold leading-[18px]">
                          Booking
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="relative flex h-[25px] w-full items-center">
                  <div className="left-0 h-2 w-1/2 rounded-full bg-cosmetics-purple" />
                  <div className="absolute right-1/2 top-0 translate-x-1/2">
                    <div className="flex flex-col items-center gap-[6px]">
                      <div className="flex h-[25px] w-[25px] items-center justify-center rounded-full bg-cosmetics-purple text-xs font-bold leading-[18px] text-white">
                        2
                      </div>
                      <p className="text-xs font-semibold leading-[18px]">
                        Payment
                      </p>
                    </div>
                  </div>
                  <div className="right-0 h-2 w-1/2 rounded-full bg-[#EDEDF5]" />
                </div>
                <div className="relative z-10 flex h-[25px] w-[60px] items-center">
                  <div className="h-2 w-[60px] rounded-full bg-[#EDEDF5]" />
                  <div className="absolute left-0 top-0 -translate-x-1/2">
                    <div className="flex flex-col items-center gap-[6px]">
                      <div className="flex h-[25px] w-[25px] items-center justify-center rounded-full bg-[#D8D8E4] text-xs font-bold leading-[18px]">
                        3
                      </div>
                      <p className="text-xs font-semibold leading-[18px]">
                        Delivery
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <header>
        <div className="flex flex-col gap-1 px-5">
          <h2 className="text-[26px] font-bold leading-[39px]">Make Payment</h2>
          <p className="text-cosmetics-grey">Data asli harus diberikan amet</p>
        </div>
      </header>
      <section id="Informations" className="px-5">
        <div className="flex flex-col gap-5 rounded-3xl bg-white px-5 py-[30px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-[10px]">
              <img
                src="/assets/images/icons/information.svg"
                alt="icon"
                className="size-[38px] shrink-0"
              />
              <div className="flex flex-col gap-1">
                <h3 className="font-semibold text-[#0C0422]">
                  Payment Details
                </h3>
                <p className="text-sm leading-[21px] text-[#8C8582]">
                  Sebelum bayar cek lagi
                </p>
              </div>
            </div>
            <button
              type="button"
              data-expand="PaymentDetailsJ"
              className="shrink-0"
            >
              <img
                src="/assets/images/icons/bottom.svg"
                alt="icon"
                className="size-6 shrink-0 transition-all duration-300"
              />
            </button>
          </div>
          <div id="PaymentDetailsJ" className="flex flex-col gap-5">
            <div className="box h-[1px] w-full" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-[6px]">
                <img
                  src="/assets/images/icons/list.svg"
                  alt="icon"
                  className="size-5 shrink-0"
                />
                <p>Total Quantity</p>
              </div>
              <strong className="font-semibold">{totalQuantity}</strong>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-[6px]">
                <img
                  src="/assets/images/icons/list.svg"
                  alt="icon"
                  className="size-5 shrink-0"
                />
                <p>Sub Total</p>
              </div>
              <strong className="font-semibold">
                {formatCurrency(subtotal)}
              </strong>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-[6px]">
                <img
                  src="/assets/images/icons/list.svg"
                  alt="icon"
                  className="size-5 shrink-0"
                />
                <p>Discount Code</p>
              </div>
              <strong className="font-semibold">Rp 0</strong>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-[6px]">
                <img
                  src="/assets/images/icons/list.svg"
                  alt="icon"
                  className="size-5 shrink-0"
                />
                <p>Delivery Fee</p>
              </div>
              <strong className="font-semibold">Rp 0 (Promo)</strong>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-[6px]">
                <img
                  src="/assets/images/icons/list.svg"
                  alt="icon"
                  className="size-5 shrink-0"
                />
                <p>Insurance</p>
              </div>
              <strong className="font-semibold">Included</strong>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-[6px]">
                <img
                  src="/assets/images/icons/list.svg"
                  alt="icon"
                  className="size-5 shrink-0"
                />
                <p>Tax 11%</p>
              </div>
              <strong className="font-semibold">{formatCurrency(tax)}</strong>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-[6px]">
                <img
                  src="/assets/images/icons/list.svg"
                  alt="icon"
                  className="size-5 shrink-0"
                />
                <p>Grand Total</p>
              </div>
              <strong className="text-[22px] font-bold leading-[33px] text-cosmetics-pink">
                {formatCurrency(grandTotal)}
              </strong>
            </div>
          </div>
        </div>
      </section>
      <section id="TrustedEwallets" className="px-5">
        <div className="flex flex-col gap-5 rounded-3xl bg-white px-[14px] py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-[10px]">
              <img
                src="/assets/images/icons/wallet.svg"
                alt="icon"
                className="size-[38px] shrink-0"
              />
              <div className="flex flex-col gap-1">
                <h3 className="font-semibold text-[#0C0422]">
                  Trusted E-Wallets
                </h3>
                <p className="text-sm leading-[21px] text-[#8C8582]">
                  Choose lorem dolor active
                </p>
              </div>
            </div>
            <button
              type="button"
              data-expand="TrustedEwalletsJ"
              className="shrink-0"
            >
              <img
                src="/assets/images/icons/bottom.svg"
                alt="icon"
                className="size-6 shrink-0 transition-all duration-300"
              />
            </button>
          </div>
          <div id="TrustedEwalletsJ" className="flex flex-col gap-5">
            <div className="box h-[1px] w-full" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src="/assets/images/thumbnails/link-aja.png"
                  alt="image"
                  className="h-[60px] w-[80px] shrink-0"
                />
                <div>
                  <h4 className="font-semibold">LinkAja Pro</h4>
                  <p className="text-sm leading-[21px] text-cosmetics-grey">
                    Offline
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-[#F6F6F8] px-[14px] py-2">
                <p className="text-sm font-semibold leading-[21px] text-[#ACACB9]">
                  Inactive
                </p>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src="/assets/images/thumbnails/ovo.png"
                  alt="image"
                  className="h-[60px] w-[80px] shrink-0"
                />
                <div>
                  <h4 className="font-semibold">OVO Inter</h4>
                  <p className="text-sm leading-[21px] text-cosmetics-grey">
                    Offline
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-[#F6F6F8] px-[14px] py-2">
                <p className="text-sm font-semibold leading-[21px] text-[#ACACB9]">
                  Inactive
                </p>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src="/assets/images/thumbnails/gopay.png"
                  alt="image"
                  className="h-[60px] w-[80px] shrink-0"
                />
                <div>
                  <h4 className="font-semibold">Link Aja</h4>
                  <p className="text-sm leading-[21px] text-cosmetics-grey">
                    Offline
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-[#F6F6F8] px-[14px] py-2">
                <p className="text-sm font-semibold leading-[21px] text-[#ACACB9]">
                  Inactive
                </p>
              </span>
            </div>
          </div>
        </div>
      </section>
      <section id="CasOnDelivery" className="px-5">
        <div className="flex flex-col gap-5 rounded-3xl bg-white px-[14px] py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-[10px]">
              <img
                src="/assets/images/icons/cash.svg"
                alt="icon"
                className="size-[38px] shrink-0"
              />
              <div className="flex flex-col gap-1">
                <h3 className="font-semibold text-[#0C0422]">
                  Cash on Delivery
                </h3>
                <p className="text-sm leading-[21px] text-[#8C8582]">
                  Choose lorem dolor active
                </p>
              </div>
            </div>
            <button
              type="button"
              data-expand="CasOnDeliveryJ"
              className="shrink-0"
            >
              <img
                src="/assets/images/icons/bottom.svg"
                alt="icon"
                className="size-6 shrink-0 transition-all duration-300"
              />
            </button>
          </div>
          <div id="CasOnDeliveryJ" className="flex flex-col gap-5">
            <div className="box h-[1px] w-full" />
            <div className="rounded-2xl bg-[#F6F6F8] p-[10px]">
              <p className="text-sm">
                Layanan pembayaran ini belum si amet tersedia karena sedang
                proses dolor.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section id="BankTransfer" className="px-5">
        <div className="flex flex-col gap-5 rounded-3xl bg-white px-[14px] py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-[10px]">
              <img
                src="/assets/images/icons/banktf.svg"
                alt="icon"
                className="size-[38px] shrink-0"
              />
              <div className="flex flex-col gap-1">
                <h3 className="font-semibold text-[#0C0422]">Bank Transfer</h3>
                <p className="text-sm leading-[21px] text-[#8C8582]">
                  Choose lorem dolor active
                </p>
              </div>
            </div>
            <button
              type="button"
              data-expand="BankTransferJ"
              className="shrink-0"
            >
              <img
                src="/assets/images/icons/bottom.svg"
                alt="icon"
                className="size-6 shrink-0 transition-all duration-300"
              />
            </button>
          </div>
          <div id="BankTransferJ" className="flex flex-col gap-5">
            <div className="box h-[1px] w-full" />
            <div className="flex items-start gap-4">
              <img
                src="/assets/images/thumbnails/bca.png"
                alt="image"
                className="h-[60px] w-[81px] shrink-0"
              />
              <div>
                <h4 className="text-sm leading-[21px] text-cosmetics-grey">
                  Bank Central Asia
                </h4>
                <strong className="font-semibold">9893981092</strong>
                <p className="text-sm leading-[21px] text-cosmetics-grey">
                  PT Shayna Beauty
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <img
                src="/assets/images/thumbnails/mandiri.png"
                alt="image"
                className="h-[60px] w-[81px] shrink-0"
              />
              <div>
                <h4 className="text-sm leading-[21px] text-cosmetics-grey">
                  Bank Mandiri
                </h4>
                <strong className="font-semibold">193084820912</strong>
                <p className="text-sm leading-[21px] text-cosmetics-grey">
                  PT Shayna Beauty
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-5">
        <section id="PaymentConfirmation">
          <div className="flex flex-col gap-5 rounded-3xl bg-white px-[14px] py-5">
            <div className="flex items-center gap-[10px]">
              <img
                src="/assets/images/icons/information.svg"
                alt="icon"
                className="size-[38px] shrink-0"
              />
              <div className="flex flex-col gap-1">
                <h3 className="font-semibold text-[#0C0422]">
                  Payment Confirmation
                </h3>
                <p className="text-sm leading-[21px] text-[#8C8582]">
                  Upload bukti transfer lorem dor
                </p>
              </div>
            </div>
            <div className="box h-[1px] w-full" />
            <label className="flex flex-col gap-[6px]">
              <h4 className="font-semibold text-[#030504]">Proof of Payment</h4>
              <div className="group relative flex h-[54px] items-center justify-center rounded-full bg-[#E0E0EC] transition-all duration-300 focus-within:bg-cosmetics-gradient-purple-pink">
                <div className="h-[calc(100%_-_2px)] w-[calc(100%_-_2px)] rounded-full bg-[#F6F6F8] transition-all duration-300 focus-within:h-[calc(100%_-_4px)] focus-within:w-[calc(100%_-_4px)]">
                  <p
                    id="upload"
                    className="absolute left-[57px] top-1/2 -translate-y-1/2 py-[15px] text-[#ACACB9]"
                  >
                    Add an attachment
                  </p>
                  <input
                    type="file"
                    name="proof"
                    onChange={handleFileChange}
                    id="file-upload"
                    className="absolute top-1/2 w-full -translate-y-1/2 rounded-full py-[15px] pl-[57px] pr-[13px] font-semibold text-[#030504] opacity-0 file:hidden focus:outline-none"
                  />
                  <div className="absolute left-[14px] top-1/2 flex w-[35px] -translate-y-1/2 justify-between">
                    <img
                      src="/assets/images/icons/list.svg"
                      alt="icon"
                      className="size-[24px] shrink-0"
                    />
                    <span className="h-[26px] w-px bg-[#E0E0EC] transition-all duration-300 group-focus-within:bg-cosmetics-gradient-purple-pink" />
                  </div>
                </div>
              </div>
              {formErrors.find((error) => error.path.includes("proof")) && (
                <p className="text-sm leading-[21px] text-[#E70011]">
                  {
                    formErrors.find((error) => error.path.includes("proof"))
                      ?.message
                  }
                </p>
              )}
            </label>
            <button
              disabled={loading}
              type="submit"
              className="flex w-full items-center justify-between rounded-full bg-cosmetics-gradient-pink-white px-5 py-[14px] transition-all duration-300 hover:shadow-[0px_6px_22px_0px_#FF4D9E82]"
            >
              <strong className="font-semibold text-white">
                {loading ? "Processing..." : "Submit Payment"}
              </strong>
              <img
                src="/assets/images/icons/right.svg"
                alt="icon"
                className="size-[24px] shrink-0"
              />
            </button>
          </div>
        </section>
      </form>
    </main>
  );
}
