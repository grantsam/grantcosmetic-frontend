import { Swiper, SwiperSlide } from "swiper/react";
import { Category, Cosmetic } from "../types/type";
import { useEffect, useState } from "react";
import apiClient from "../services/apiServices";

const fetchCategories = async () => {
  const response = await apiClient.get("/category");
  return response.data.data;
};

const fetchPopularCosmetics = async () => {
  const response = await apiClient.get("/cosmetic?limit=4&is_popular=1");
  return response.data.data;
};

const fetchAllCosmetics = async () => {
  const response = await apiClient.get("/cosmetic?limit=4");
  return response.data.data;
};

export default function BrowsePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [popularCosmetics, setPopularCosmetics] = useState<Cosmetic[]>([]);
  const [allCosmetics, setAllCosmetics] = useState<Cosmetic[]>([]);

  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingPopularCosmetics, setLoadingPopularCosmetics] = useState(true);
  const [loadingAllCosmetics, setLoadingAllCosmetics] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        const categoriesData = await fetchCategories();
        console.log("Categories API response:", categoriesData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to fetch categories");
      } finally {
        setLoadingCategories(false);
      }
    };

    const fetchPopularCosmeticsData = async () => {
      try {
        const popularCosmeticsData = await fetchPopularCosmetics();
        setPopularCosmetics(popularCosmeticsData);
      } catch {
        setError("Failed to fetch popular cosmetics");
      } finally {
        setLoadingPopularCosmetics(false);
      }
    };

    const fetchCosmeticsData = async () => {
      try {
        const cosmeticsData = await fetchAllCosmetics();
        setAllCosmetics(cosmeticsData);
      } catch {
        setError("Failed to fetch all cosmetics");
      } finally {
        setLoadingAllCosmetics(false);
      }
    };

    fetchCategoriesData();
    fetchPopularCosmeticsData();
    fetchCosmeticsData();
  }, []);

  if (loadingCategories && loadingPopularCosmetics && loadingAllCosmetics) {
    return <p>loading...</p>;
  }
  if (error) {
    return <p>Error loading data : {error}</p>;
  }
  //formatCurrency function to format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const BASE_URL = import.meta.env.VITE_API_STORAGE_URL;

  return (
    <main className="mx-auto flex min-h-screen max-w-[640px] flex-col gap-5 bg-white pb-[141px]">
      <section id="Info">
        <div className="mt-5 flex items-center justify-between px-5">
          <div className="language flex h-[32px] items-center gap-[10px]">
            <button type="button" className="indo flex items-center gap-[6px]">
              <img
                src="/assets/images/icons/id.svg"
                alt="icon"
                className="h-[15px] w-5 shrink-0"
              />
              <p className="text-xs font-semibold leading-[18px]">ID</p>
            </button>
            <span className="block h-full w-px bg-cosmetics-greylight" />
            <button type="button" className="jpn flex items-center gap-[6px]">
              <img
                src="/assets/images/icons/jp.svg"
                alt="icon"
                className="h-[15px] w-5 shrink-0"
              />
              <p className="text-xs font-semibold leading-[18px]">JP</p>
            </button>
          </div>
          <div className="flex items-center gap-[6px]">
            <img
              src="/assets/images/icons/telp.svg"
              alt="icon"
              className="size-5 shrink-0"
            />
            <strong className="text-xs font-semibold leading-[18px]">
              62821202019213
            </strong>
          </div>
        </div>
      </section>
      <section id="Company">
        <div className="flex justify-between px-5">
          <a href="">
            <img
              src="/assets/images/logos/shayna.svg"
              alt="icon"
              className="h-[48px] w-[113px] shrink-0"
            />
          </a>
          <div className="flex items-center gap-[10px]">
            <a
              href=""
              className="flex size-[44px] items-center justify-center rounded-full bg-cosmetics-greylight p-px transition-all duration-300 hover:bg-cosmetics-gradient-purple-pink hover:p-[2px]"
            >
              <div className="flex h-full w-full shrink-0 items-center justify-center rounded-full bg-white">
                <img
                  src="/assets/images/icons/search.svg"
                  alt="icon"
                  className="size-5 shrink-0"
                />
              </div>
            </a>
            <a
              href="my-cart.html"
              className="flex size-[44px] items-center justify-center rounded-full bg-cosmetics-greylight p-px transition-all duration-300 hover:bg-cosmetics-gradient-purple-pink hover:p-[2px]"
            >
              <div className="flex h-full w-full shrink-0 items-center justify-center rounded-full bg-white">
                <img
                  src="/assets/images/icons/cart.svg"
                  alt="icon"
                  className="size-5 shrink-0"
                />
              </div>
            </a>
          </div>
        </div>
      </section>
      <section id="Hero">
        <div id="HeroSlider" className="swiper w-full overflow-x-hidden">
          <Swiper
            className="swiper-wrapper"
            direction="horizontal"
            spaceBetween={16}
            slidesPerView="auto"
            slidesOffsetAfter={20}
            slidesOffsetBefore={20}
          >
            <SwiperSlide className="swiper-slide !w-fit">
              <a href="">
                <div className="flex h-[190px] w-[320px] items-center justify-center overflow-hidden rounded-3xl">
                  <img
                    src="/assets/images/thumbnails/girls-day.png"
                    alt="image"
                    className="h-full w-full object-cover"
                  />
                </div>
              </a>
            </SwiperSlide>
            <SwiperSlide className="swiper-slide !w-fit">
              <a href="">
                <div className="flex h-[190px] w-[320px] items-center justify-center overflow-hidden rounded-3xl">
                  <img
                    src="/assets/images/thumbnails/beuty-tips.png"
                    alt="image"
                    className="h-full w-full object-cover"
                  />
                </div>
              </a>
            </SwiperSlide>
            <SwiperSlide className="swiper-slide !w-fit">
              <a href="">
                <div className="flex h-[190px] w-[320px] items-center justify-center overflow-hidden rounded-3xl">
                  <img
                    src="/assets/images/thumbnails/discount-for.png"
                    alt="image"
                    className="h-full w-full object-cover"
                  />
                </div>
              </a>
            </SwiperSlide>
          </Swiper>
        </div>
      </section>
      <section id="TopCategories">
        <div className="flex flex-col gap-4 px-5">
          <h2 className="font-bold">Top Categories</h2>
          <div className="categories-cards grid grid-cols-3 gap-4">
            {Array.isArray(categories) && categories.length > 0 ? (
              categories.map((category) => (
                <a href="category.html">
                  <div className="flex h-[142px] items-center justify-center rounded-3xl bg-cosmetics-greylight p-px transition-all duration-300 hover:bg-cosmetics-gradient-purple-pink hover:p-[2px]">
                    <div className="flex h-full w-full flex-col items-center justify-center rounded-[23px] bg-white px-[10px] hover:rounded-[22px]">
                      <div className="mb-[10px] flex size-[60px] items-center justify-center overflow-hidden rounded-full">
                        <img
                          src={`${import.meta.env.VITE_REACT_API_STORAGE_URL}/${
                            category.photo
                          }`}
                          alt="image"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <h3 className="mb-[2px] text-center text-sm font-semibold leading-[21px]">
                        {category.name}
                      </h3>
                      <p className="text-center text-sm leading-[21px] text-cosmetics-grey">
                        {category.cosmetics_count}
                      </p>
                    </div>
                  </div>
                </a>
              ))
            ) : (
              <p> no categories available</p>
            )}
          </div>
        </div>
      </section>
      <section id="PopularChoices">
        <div className="flex flex-col gap-4 bg-[#F6F6F8] pb-[30px] pt-5">
          <h2 className="px-5 font-bold">Popular Choices</h2>
          <div
            id="PopularChoicesSlider"
            className="swiper w-full overflow-x-hidden"
          >
            <Swiper
              className="swiper-wrapper"
              direction="horizontal"
              spaceBetween={16}
              slidesPerView="auto"
              slidesOffsetAfter={20}
              slidesOffsetBefore={20}
            >
              {Array.isArray(popularCosmetics) &&
              popularCosmetics.length > 0 ? (
                popularCosmetics.map((cosmetic) => (
                  <SwiperSlide className="swiper-slide !w-fit">
                    <a href="details.html">
                      <div className="relative flex h-[276px] w-[222px] items-center justify-center rounded-3xl transition-all duration-300 hover:bg-cosmetics-gradient-purple-pink hover:p-[2px]">
                        <div className="flex h-full flex-col justify-center gap-4 rounded-[23px] bg-white px-4 hover:rounded-[22px]">
                          <span className="absolute right-[14px] top-[14px] flex items-center justify-center gap-[2px] rounded-full bg-cosmetics-purple px-2 py-[6px]">
                            <img
                              src="/assets/images/icons/star.svg"
                              alt="icon"
                              className="size-4 shrink-0"
                            />
                            <p className="text-xs font-bold leading-[18px] text-white">
                              4.8
                            </p>
                          </span>
                          <div className="mx-auto flex h-[130px] w-full items-center justify-center">
                            <img
                              src={`${
                                import.meta.env.VITE_REACT_API_STORAGE_URL
                              }/${cosmetic.thumbnail}`}
                              alt="image"
                              className="h-full w-full object-contain"
                            />
                          </div>
                          <div className="des flex flex-col gap-1">
                            <h4 className="text-xs leading-[18px] text-cosmetics-purple">
                              {cosmetic.brand.name.toUpperCase()}
                            </h4>
                            <h3 className="line-clamp-2 h-[48px] w-full font-semibold">
                              CoverBlur Powder Foundation Natural
                            </h3>
                            <strong className="font-semibold text-cosmetics-pink">
                              {formatCurrency(cosmetic.price)}
                            </strong>
                          </div>
                        </div>
                      </div>
                    </a>
                  </SwiperSlide>
                ))
              ) : (
                <p> no categories available</p>
              )}
            </Swiper>
          </div>
        </div>
      </section>
      <section id="FreshThisSummer">
        <div className="flex flex-col gap-4 px-5">
          <h2 className="font-bold">Fresh This Summer</h2>

          {Array.isArray(allCosmetics) && allCosmetics.length > 0 ? (
            allCosmetics.map((cosmetic) => (
              <a href="details.html">
                <div className="flex h-[130px] items-center justify-center rounded-3xl bg-cosmetics-greylight p-px transition-all duration-300 hover:bg-cosmetics-gradient-purple-pink hover:p-[2px]">
                  <div className="flex h-full w-full items-center gap-4 rounded-[23px] bg-white px-4 hover:rounded-[22px]">
                    <div className="flex size-[90px] shrink-0 items-center justify-center">
                      <img
                        src={`${import.meta.env.VITE_REACT_API_STORAGE_URL}/${
                          cosmetic.thumbnail
                        }`}
                        alt="image"
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div className="flex w-full flex-col gap-[2px]">
                      <h4 className="text-xs leading-[18px] text-cosmetics-purple">
                        {cosmetic.brand.name.toUpperCase()}
                      </h4>
                      <h3 className="line-clamp-2 h-[48px] w-full font-semibold">
                        {cosmetic.description}
                      </h3>
                      <div className="flex items-center justify-between">
                        <strong className="font-semibold text-cosmetics-pink">
                          {formatCurrency(cosmetic.price)}
                        </strong>
                        <div className="flex items-center justify-center gap-[2px]">
                          <img
                            src="/assets/images/icons/star.svg"
                            alt="icon"
                            className="size-4 shrink-0"
                          />
                          <p className="text-xs font-bold leading-[18px]">
                            4.8
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            ))
          ) : (
            <p> no categories available</p>
          )}
        </div>
      </section>
      <nav className="fixed bottom-0 left-0 right-0 z-30 mx-auto w-full">
        <div className="mx-auto max-w-[640px]">
          <div className="h-[89px] bg-white px-[30px] shadow-[0px_-4px_30px_0px_#1107260D]">
            <ul className="flex justify-between">
              <li className="flex items-center">
                <a href="">
                  <div className="flex w-[50px] flex-col items-center gap-1">
                    <img
                      src="/assets/images/icons/browse.svg"
                      alt="icon"
                      className="size-6 shrink-0"
                    />
                    <p className="text-sm font-semibold leading-[21px] text-cosmetics-pink">
                      Browse
                    </p>
                  </div>
                </a>
              </li>
              <li className="flex items-center">
                <a href="view-orders.html">
                  <div className="flex w-[50px] flex-col items-center gap-1">
                    <img
                      src="/assets/images/icons/car.svg"
                      alt="icon"
                      className="size-6 shrink-0"
                    />
                    <p className="text-sm leading-[21px]">Orders</p>
                  </div>
                </a>
              </li>
              <li>
                <a href="" className="relative -top-[23px]">
                  <div className="relative flex h-[80px] w-[80px] items-center justify-center rounded-full bg-[#FAF9FA]">
                    <div className="flex size-[65px] items-center justify-center rounded-full bg-cosmetics-gradient-pink-white transition-shadow duration-300 hover:shadow-[0px_6px_10px_0px_#FF4D9E6E]">
                      <img
                        src="/assets/images/icons/video.svg"
                        alt="icon"
                        className="size-[30px] shrink-0"
                      />
                    </div>
                  </div>
                </a>
              </li>
              <li className="flex items-center">
                <a href="">
                  <div className="flex w-[50px] flex-col items-center gap-1">
                    <img
                      src="/assets/images/icons/gift.svg"
                      alt="icon"
                      className="size-6 shrink-0"
                    />
                    <p className="text-sm leading-[21px]">Perks</p>
                  </div>
                </a>
              </li>
              <li className="flex items-center">
                <a href="">
                  <div className="flex w-[50px] flex-col items-center gap-1">
                    <img
                      src="/assets/images/icons/message.svg"
                      alt="icon"
                      className="size-6 shrink-0"
                    />
                    <p className="text-sm leading-[21px]">Helps</p>
                  </div>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </main>
  );
}
