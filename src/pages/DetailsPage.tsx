import { CartItem, Cosmetic } from "../types/type";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import apiClient from "../services/apiServices";
import { Swiper, SwiperSlide } from "swiper/react";

export default function Detailspage() {
  const { slug } = useParams<{ slug: string }>();

  const [cosmetic, setCosmetic] = useState<Cosmetic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  const [mainImage, setMainImage] = useState<string>("");

  //load cart from local storage on page load
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  //load cosmetic from api
  useEffect(() => {
    apiClient
      .get(`/cosmetic/${slug}`)
      .then((response) => {
        setCosmetic(response.data.data);
        setMainImage(response.data.data.thumbnail);
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to load data");
        setLoading(false);
      });
  }, [slug]);

  const handleAddToCart = () => {
    if (cosmetic) {
      setIsAdding(true);
      const existingItem = cart.find((item) => item.cosmetic_id === cosmetic.id);
      if (existingItem) {
        alert("Item already in cart");
        setIsAdding(false);
      }
      else {
        const newItem : CartItem = {
          cosmetic_id: cosmetic.id,
          slug: cosmetic.slug,
          quantity: 1, // default quantity is 1
        }

        const updatedCart = [...cart, newItem];
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));

        alert("Item added to cart");
        setIsAdding(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg font-bold">Loading...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg font-bold text-red-500">{error}</p>
      </div>
    );
  }
  if (!cosmetic) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg font-bold">Cosmetic not found</p>
      </div>
    );
  }

  const BASE_URL = import.meta.env.VITE_REACT_API_STORAGE_URL;

  //formatCurrency function to format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-[640px] flex-col gap-5 bg-[#F6F6F8]">
      <section id="NavTop">
        <div className="relative mt-5 px-5">
          <div className="flex w-full items-center justify-between rounded-3xl bg-white px-3 py-3">
            <Link to="/">
              <div className="flex size-[44px] shrink-0 items-center justify-center rounded-full border border-cosmetics-greylight">
                <img
                  src="/assets/images/icons/left.svg"
                  alt="icon"
                  className="size-5 shrink-0"
                />
              </div>
            </Link>
            <div className="flex flex-col gap-[2px]">
              <h1 className="text-center text-lg font-bold leading-[27px]">
                Product Details
              </h1>
              <p className="text-center text-sm leading-[21px] text-cosmetics-grey">
                You deserve beauty life
              </p>
            </div>
            <Link to = {`/cart`}>
              <div className="flex size-[44px] shrink-0 items-center justify-center rounded-full border border-cosmetics-greylight">
                <img
                  src="/assets/images/icons/cart.svg"
                  alt="icon"
                  className="size-5 shrink-0"
                />
              </div>
            </Link>
          </div>
        </div>
      </section>
      <Link to ={`/cart`}>
        <div className="flex flex-col gap-5">
          <section id="HeroSlider" className="px-5">
            <div className="flex w-full flex-col items-center gap-[30px] rounded-[30px] bg-white px-[24.5px] py-[30px]">
              <div className="flex size-[250px] shrink-0 items-center justify-center">
                <img
                  src={
                    mainImage
                      ? `${BASE_URL}/${mainImage}`
                      : `${BASE_URL}/${cosmetic.thumbnail}`
                  }
                  alt="image"
                  className="h-full w-full object-contain"
                />
              </div>

              <div className="flex items-center justify-center gap-[4px]">
                <div
                  className={`h-[72px] w-[72px] rounded-full  
                  ${
                    mainImage === cosmetic.thumbnail
                      ? "bg-cosmetics-gradient-purple-pink"
                      : ""
                  }
                  p-[2px] transition-all duration-300`}
                >
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-white">
                    <div className="flex h-[60px] w-[60px] items-center justify-center overflow-hidden rounded-full">
                      <img
                        src={`${BASE_URL}/${cosmetic.thumbnail}`}
                        onClick={() => setMainImage(cosmetic.thumbnail)}
                        alt="image"
                        className="size-[45px]"
                      />
                    </div>
                  </div>
                </div>

                {cosmetic.photos.length > 0 ? (
                  cosmetic.photos.map((photo) => (
                    <div key={photo.id} 
                      className={`h-[72px] w-[72px] rounded-full
                      ${
                        mainImage === photo.photo
                          ? "bg-cosmetics-gradient-purple-pink"
                          : ""
                      } 
                    p-[2px] transition-all duration-300`}
                    >
                      <div className="flex h-full w-full items-center justify-center rounded-full bg-white">
                        <div className="flex h-[60px] w-[60px] items-center justify-center overflow-hidden rounded-full">
                          <img
                            src={`${BASE_URL}/${photo.photo}`}
                            onClick={() => setMainImage(photo.photo)}
                            alt="image"
                            className="size-[45px]"
                          />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-sm text-cosmetics-grey">
                    No photos available
                  </p>
                )}
              </div>
            </div>
          </section>
          {cosmetic.is_popular ? (
            <section id="Ads">
              <div className="px-5">
                <div className="relative flex items-center gap-[10px] rounded-[20px] bg-[linear-gradient(87deg,_#360CAC_16.85%,_#FF4D9F_81.08%)] px-5 py-[19px]">
                  <img
                    src="/assets/images/icons/popular.svg"
                    alt="icon "
                    className="size-[32px] shrink-0"
                  />
                  <h5 className="text-[18px] font-semibold leading-[27px] text-white">
                    Popular This Year
                  </h5>
                  <img
                    src="/assets/images/icons/3-star.svg"
                    alt="icon"
                    className="absolute bottom-[3px] right-[21px] h-[68px] w-[132px] shrink-0"
                  />
                </div>
              </div>
            </section>
          ) : (
            ""
          )}

          <header>
            <div className="flex items-center justify-between px-5">
              <div className="flex flex-col gap-1">
                <h4 className="font-semibold text-cosmetics-purple">
                  {cosmetic.brand.name.toUpperCase()}
                </h4>
                <h1 className="text-[20px] font-bold leading-[30px]">
                  {cosmetic.name}
                </h1>
              </div>
              <div className="rounded-[16px] bg-cosmetics-purple px-[12px] py-2">
                <img
                  src="/assets/images/icons/star.svg"
                  alt="icon"
                  className="mx-auto size-5 shrink-0"
                />
                <p className="font-bold text-white">4.8</p>
              </div>
            </div>
          </header>
          <section id="ImportantPoints">
            <div className="grid grid-cols-2 gap-[14px] px-5">
              <div className="flex items-center gap-[10px] rounded-[20px] bg-white pb-[14px] pl-[14px] pt-[14px]">
                <img
                  src="/assets/images/icons/calender.svg"
                  alt="icon"
                  className="size-[32px] shrink-0"
                />
                <div>
                  <h5 className="text-sm font-semibold leading-[21px] text-[#030504]">
                    {cosmetic.category.name}
                  </h5>
                  <p className="text-sm leading-[21px] text-[#43484C]">
                    Category
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-[10px] rounded-[20px] bg-white pb-[14px] pl-[14px] pt-[14px]">
                <img
                  src="/assets/images/icons/guarantee.svg"
                  alt="icon"
                  className="size-[32px] shrink-0"
                />
                <div>
                  <h5 className="text-sm font-semibold leading-[21px] text-[#030504]">
                    Guarantee
                  </h5>
                  <p className="text-sm leading-[21px] text-[#43484C]">
                    BPOM Certified
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-[10px] rounded-[20px] bg-white pb-[14px] pl-[14px] pt-[14px]">
                <img
                  src="/assets/images/icons/clock.svg"
                  alt="icon"
                  className="size-[32px] shrink-0"
                />
                <div>
                  <h5 className="text-sm font-semibold leading-[21px] text-[#030504]">
                    Refund
                  </h5>
                  <p className="text-sm leading-[21px] text-[#43484C]">
                    In 30 Days
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-[10px] rounded-[20px] bg-white pb-[14px] pl-[14px] pt-[14px]">
                <img
                  src="/assets/images/icons/top-service.svg"
                  alt="icon"
                  className="size-[32px] shrink-0"
                />
                <div>
                  <h5 className="text-sm font-semibold leading-[21px] text-[#030504]">
                    Top Service
                  </h5>
                  <p className="text-sm leading-[21px] text-[#43484C]">
                    Guarantee
                  </p>
                </div>
              </div>
            </div>
          </section>
          <section id="AboutProduct">
            <div className="flex flex-col gap-2 px-5">
              <h3 className="font-bold">About Product</h3>
              <p className="leading-[28px]">{cosmetic.description}</p>
            </div>
          </section>
          <section id="Reviews">
            <div id="ReviewsSlider" className="swiper w-full overflow-x-hidden">
              <Swiper
                className="swiper-wrapper"
                direction="horizontal"
                spaceBetween={16}
                slidesPerView="auto"
                slidesOffsetAfter={20}
                slidesOffsetBefore={20}
              >
                {cosmetic.testimonials.length > 0 ? (
                  cosmetic.testimonials.map((testimonial) => (
                    <SwiperSlide
                      className="swiper-slide !w-fit"
                      key={testimonial.id}
                    >
                      <div className="relative flex w-[330px] flex-col gap-4 rounded-3xl bg-white p-[20px]">
                        <img
                          src="/assets/images/icons/coma.svg"
                          alt="icon"
                          className="absolute left-[17px] top-[16px]"
                        />
                        <p className="relative leading-[28px] text-[#030504]">
                          {testimonial.message}
                        </p>
                        <div className="relative flex items-center justify-between">
                          <div className="flex items-center gap-[12px]">
                            <div className="flex size-[48px] shrink-0 items-center justify-center overflow-hidden rounded-full">
                              <img
                                src={`${BASE_URL}/${testimonial.photo}`}
                                alt="image"
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div>
                              <h5 className="font-semibold text-[#030504]">
                                {testimonial.name}
                              </h5>
                              <p className="text-sm leading-[21px] text-cosmetics-grey">
                                {testimonial.rating} /5
                              </p>
                            </div>
                          </div>
                          <div className="stars flex items-center">
                            <img
                              src="/assets/images/icons/star-big.svg"
                              alt="icon"
                              className="size-[20px] shrink-0"
                            />
                            <img
                              src="/assets/images/icons/star-big.svg"
                              alt="icon"
                              className="size-[20px] shrink-0"
                            />
                            <img
                              src="/assets/images/icons/star-big.svg"
                              alt="icon"
                              className="size-[20px] shrink-0"
                            />
                            <img
                              src="/assets/images/icons/star-big.svg"
                              alt="icon"
                              className="size-[20px] shrink-0"
                            />
                            <img
                              src="/assets/images/icons/star-big.svg"
                              alt="icon"
                              className="size-[20px] shrink-0"
                            />
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))
                ) : (
                  <p>belum ada testimonials</p>
                )}
              </Swiper>
            </div>
          </section>
          <section id="NaturalBenefits">
            <div className="flex flex-col gap-[14px] px-5 pb-[125px]">
              <h3 className="font-bold">Natural Benefits</h3>

              {cosmetic.benefits.length > 0 ? (
                cosmetic.benefits.map((benefit, index) => (
                  <div className="flex flex-col gap-3" key={benefit.id}>
                    <div className="flex items-center gap-3">
                      <img
                        src="/assets/images/icons/benefit.svg"
                        alt="icon"
                        className="size-[32px] shrink-0"
                      />
                      <p className="leading-[28px]">{benefit.name}</p>
                    </div>
                    {index < cosmetic.benefits.length - 1 && (
                      <hr className="border-[#E3E#E4]" />
                    )}
                  </div>
                ))
              ) : (
                <p>belum ada review</p>
              )}

              <div className="flex items-center gap-3">
                <img
                  src="/assets/images/icons/benefit.svg"
                  alt="icon"
                  className="size-[32px] shrink-0"
                />
                <p className="leading-[28px]">
                  Kandungan tanpa tambahan toxic sehingga aman untuk jenis
                  wajahmu
                </p>
              </div>
            </div>
          </section>
        </div>
        <nav className="fixed bottom-0 left-0 right-0 z-30">
          <div className="relative mx-auto flex max-w-[640px] items-center gap-[55px] bg-white p-5">
            <div className="flex flex-col gap-1 text-start">
              <strong className="whitespace-nowrap text-xl font-bold leading-[30px]">
                {formatCurrency(cosmetic.price)}
              </strong>
              <p className="text-sm leading-[21px] text-cosmetics-grey">
                /quantity
              </p>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="flex w-full items-center justify-center gap-[10px] rounded-full bg-cosmetics-gradient-pink-white py-[14px] transition-all duration-300 hover:shadow-[0px_6px_22px_0px_#FF4D9E82]"
            >
              <p className="font-semibold text-white">
                {isAdding ? "Adding..." : "Add to Cart"}
              </p>
              <img
                src="/assets/images/icons/cart-white.svg"
                alt="icon"
                className="size-[24px] shrink-0"
              />
            </button>
          </div>
        </nav>
      </Link>
    </main>
  );
}
