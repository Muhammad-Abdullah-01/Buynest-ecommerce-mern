import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, ShoppingBag, Truck, ShieldCheck, RefreshCw, Star, ChevronLeft, ChevronRight, Heart, Sparkles } from 'lucide-react';
import { getProducts } from '../services/productService.js';
import { getCategories } from '../services/categoryService.js';
import ProductCard from '../components/product/ProductCard.jsx';
import Loader from '../components/common/Loader.jsx';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch featured products (latest 4)
  const { data: productData, isLoading: productsLoading } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: () => getProducts({ pageSize: 4, sortBy: 'createdAt' }),
    staleTime: 5 * 60 * 1000
  });

  // Fetch categories
  const { data: categoryData, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 5 * 60 * 1000
  });

  const featuredProducts = productData?.products || [];
  const categories = categoryData?.categories || [];

  // Carousel Slides Content
  const slides = [
    {
      id: 1,
      badge: "School Essentials 2026",
      title: "Must-Have Gear For Students",
      subtitle: "Gear up for learning with our curated collection of backpacks, tech accessories, and ergonomic study tools.",
      bgGradient: "from-violet-600 via-indigo-600 to-blue-700",
      image: "/hero_slide_1.png",
      ctaText: "Shop Back to School",
      ctaLink: "/shop?keyword=backpack"
    },
    {
      id: 2,
      badge: "Summer Collection",
      title: "Define Your Own Space",
      subtitle: "Elevate your look with lightweight fabrics, premium aesthetic designs, and contemporary streetwear.",
      bgGradient: "from-rose-500 via-orange-500 to-amber-500",
      image: "/hero_slide_2.png",
      ctaText: "Explore Apparel",
      ctaLink: "/shop?category=mens"
    },
    {
      id: 3,
      badge: "Modern Interior",
      title: "Elevated Kitchen Aesthetics",
      subtitle: "Sleek coffee makers, minimalist kettles, and high-performance cooking tools crafted for the modern home.",
      bgGradient: "from-emerald-600 via-teal-600 to-cyan-600",
      image: "/hero_slide_3.png",
      ctaText: "Shop Kitchen Essentials",
      ctaLink: "/shop?keyword=kettle"
    }
  ];

  // Auto sliding logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Amazon-style Category Grid Blocks Configuration
  const categoryGridItems = [
    {
      id: "school-supplies",
      title: "Must-haves for every student",
      linkText: "Shop Back to School",
      link: "/shop?keyword=backpack",
      items: [
        { name: "Backpacks", img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80", link: "/shop?keyword=backpack" },
        { name: "Electronics", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80", link: "/shop?keyword=accessories" },
        { name: "Stationery", img: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&q=80", link: "/shop?keyword=stationery" },
        { name: "Fashion", img: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80", link: "/shop?category=womens" }
      ]
    },
    {
      id: "gaming-tech",
      title: "Get your game on",
      linkText: "Shop Gaming & Tech",
      link: "/shop?keyword=controller",
      items: [
        { name: "Controllers", img: "https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=400&q=80", link: "/shop?keyword=controller" },
        { name: "Headsets", img: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&q=80", link: "/shop?keyword=headset" },
        { name: "Keyboards", img: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&q=80", link: "/shop?keyword=keyboard" },
        { name: "Mice", img: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400&q=80", link: "/shop?keyword=mouse" }
      ]
    },
    {
      id: "kitchen-essentials",
      title: "Top categories in Kitchen",
      linkText: "Explore Kitchen",
      link: "/shop?keyword=cooker",
      items: [
        { name: "Kettles", img: "https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=400&q=80", link: "/shop?keyword=kettle" },
        { name: "Cookers", img: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=400&q=80", link: "/shop?keyword=cooker" },
        { name: "Pots & Pans", img: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=400&q=80", link: "/shop?keyword=pot" },
        { name: "Coffee Makers", img: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&q=80", link: "/shop?keyword=coffee" }
      ]
    },
    {
      id: "fashion-trends",
      title: "Fashion trends you like",
      linkText: "Explore More",
      link: "/shop?category=mens",
      items: [
        { name: "Jackets", img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80", link: "/shop?keyword=jacket" },
        { name: "Shoes", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80", link: "/shop?keyword=shoe" },
        { name: "Dresses", img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&q=80", link: "/shop?keyword=dress" },
        { name: "Knitwear", img: "https://images.unsplash.com/photo-1574164904299-3a102b110380?w=400&q=80", link: "/shop?keyword=knitwear" }
      ]
    }
  ];

  return (
    <div className="relative space-y-20 pb-20 overflow-hidden">
      
      {/* =========================================================
          PARTIAL OVERLAY VISUAL DECORATIONS (World-Class Aesthetics)
          ========================================================= */}
      {/* Floating partial product decoration (Sneaker/Car-style side graphics) */}
      <div className="absolute top-[35rem] -left-20 w-72 h-72 opacity-15 md:opacity-25 pointer-events-none select-none animate-float z-0">
        <img 
          src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80" 
          alt="Floating design detail left" 
          className="w-full h-full object-contain filter drop-shadow-[0_20px_50px_rgba(99,102,241,0.3)] rotate-45"
        />
      </div>

      <div className="absolute top-[85rem] -right-24 w-80 h-80 opacity-20 md:opacity-30 pointer-events-none select-none animate-float-delayed z-0">
        <img 
          src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80" 
          alt="Floating design detail right" 
          className="w-full h-full object-contain filter drop-shadow-[0_20px_50px_rgba(168,85,247,0.3)] -rotate-12"
        />
      </div>

      {/* =========================================================
          INTERACTIVE HERO CAROUSEL
          ========================================================= */}
      <section className="relative w-full h-[550px] md:h-[600px] rounded-3xl overflow-hidden shadow-2xl z-10">
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full flex flex-col md:flex-row items-center justify-between py-12 px-6 sm:px-12 md:px-20 transition-all duration-1000 ease-in-out ${
                isActive 
                  ? 'opacity-100 translate-x-0 scale-100 pointer-events-auto' 
                  : 'opacity-0 translate-x-8 scale-95 pointer-events-none'
              }`}
            >
              {/* Slide Background with soft Radial Glow */}
              <div className={`absolute inset-0 bg-gradient-to-tr ${slide.bgGradient}`} />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.15),transparent_45%)]" />

              {/* Text Content */}
              <div className="relative w-full md:w-1/2 space-y-6 z-20 text-center md:text-left mt-8 md:mt-0">
                <span className="inline-flex items-center space-x-1.5 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider animate-pulse-slow">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>{slide.badge}</span>
                </span>
                
                <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight drop-shadow-sm">
                  {slide.title}
                </h1>
                
                <p className="text-white/80 text-sm md:text-lg max-w-lg font-light leading-relaxed">
                  {slide.subtitle}
                </p>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
                  <Link
                    to={slide.ctaLink}
                    className="flex items-center space-x-2 bg-white text-slate-900 hover:bg-slate-50 font-bold px-8 py-3.5 rounded-full shadow-lg shadow-black/10 hover:shadow-black/20 hover:-translate-y-0.5 transition-all w-full sm:w-auto justify-center"
                  >
                    <ShoppingBag className="w-5 h-5 text-indigo-600" />
                    <span>{slide.ctaText}</span>
                  </Link>
                </div>
              </div>

              {/* Hero Image Mock with floating elements */}
              <div className="relative w-full md:w-1/2 h-full flex items-center justify-center z-25 mt-4 md:mt-0 select-none">
                {/* Floating Decorative Rings */}
                <div className="absolute w-72 h-72 rounded-full border border-white/10 animate-float" />
                <div className="absolute w-96 h-96 rounded-full border border-white/5 animate-float-delayed" />
                
                {/* The main high-fidelity product mockup */}
                <div className="relative w-72 h-72 md:w-[420px] md:h-[420px] filter drop-shadow-[0_25px_60px_rgba(0,0,0,0.45)] hover:scale-105 transition-transform duration-500">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-contain select-none"
                    draggable="false"
                  />
                </div>
              </div>
            </div>
          );
        })}

        {/* Carousel Slide Navigation Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/10 hover:scale-110 active:scale-95 transition-all shadow-md"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/10 hover:scale-110 active:scale-95 transition-all shadow-md"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Carousel Indicators (Dots) */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex space-x-3 bg-black/10 backdrop-blur-md py-2 px-4 rounded-full border border-white/10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-white w-6' : 'bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </section>

      {/* =========================================================
          FEATURE BADGES SECTION
          ========================================================= */}
      <section className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 z-10">
        {[
          { icon: <Truck className="w-6 h-6" />, title: "Free Shipping", desc: "On all orders over $100" },
          { icon: <ShieldCheck className="w-6 h-6" />, title: "Secure Payment", desc: "100% secure Stripe Checkout" },
          { icon: <RefreshCw className="w-6 h-6" />, title: "Easy Returns", desc: "30-day money-back guarantee" },
          { icon: <Star className="w-6 h-6" />, title: "Premium Quality", desc: "Curated boutique products" }
        ].map((badge, i) => (
          <div 
            key={i} 
            className="bg-white/60 backdrop-blur-sm border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-100 hover:-translate-y-0.5 transition-all duration-300 flex items-center space-x-4 group"
          >
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
              {badge.icon}
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm">{badge.title}</h4>
              <p className="text-xs text-slate-500">{badge.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* =========================================================
          AMAZON-STYLE COLLAGE GRID BLOCKS (Rich Category Catalog)
          ========================================================= */}
      <section className="relative space-y-8 z-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Explore Our Collections</h2>
          <p className="text-sm text-slate-500">Pick from our premium selected products across top trending categories.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categoryGridItems.map((block) => (
            <div 
              key={block.id} 
              className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between"
            >
              <div>
                <h3 className="font-extrabold text-slate-800 text-lg mb-4 line-clamp-1">{block.title}</h3>
                
                {/* 2x2 Grid of items */}
                <div className="grid grid-cols-2 gap-4">
                  {block.items.map((sub, idx) => (
                    <Link 
                      key={idx} 
                      to={sub.link} 
                      className="group flex flex-col items-center space-y-1 text-center"
                    >
                      <div className="w-full aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 relative">
                        <img 
                          src={sub.img} 
                          alt={sub.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                      </div>
                      <span className="text-xs font-bold text-slate-700 group-hover:text-indigo-600 transition-colors line-clamp-1">
                        {sub.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-50">
                <Link 
                  to={block.link} 
                  className="text-xs font-extrabold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center space-x-1 hover:translate-x-0.5"
                >
                  <span>{block.linkText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================
          FEATURED PRODUCTS (Dynamic Database Catalog)
          ========================================================= */}
      <section className="relative space-y-6 z-10">
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">New Arrivals</h2>
            <p className="text-sm text-slate-500">Discover fresh additions hand-picked for quality and design.</p>
          </div>
          <Link 
            to="/shop" 
            className="text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 hover:translate-x-0.5 transition-transform"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {productsLoading ? (
          <Loader />
        ) : featuredProducts.length === 0 ? (
          /* Placeholder Featured Products if database is newly initialized and empty */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { id: "p1", name: "Premium Canvas Backpack", price: 120, category: "School", rating: 5, img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=450&q=80" },
              { id: "p2", name: "Wireless ANC Headphones", price: 180, category: "Electronics", rating: 5, img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=450&q=80" },
              { id: "p3", name: "Minimalist Electric Kettle", price: 75, category: "Kitchen", rating: 4, img: "https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=450&q=80" },
              { id: "p4", name: "Aesthetic Leather Sneakers", price: 95, category: "Fashion", rating: 5, img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=450&q=80" }
            ].map((p) => (
              <div 
                key={p.id} 
                className="bg-white border border-slate-100 rounded-3xl p-4 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 relative group flex flex-col"
              >
                {/* Wishlist button */}
                <button className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/80 hover:bg-white text-slate-400 hover:text-rose-500 shadow-sm border border-slate-100 hover:scale-110 active:scale-95 transition-all">
                  <Heart className="w-4 h-4" />
                </button>

                {/* Product Image */}
                <div className="w-full aspect-square rounded-2xl overflow-hidden bg-slate-50 relative border border-slate-100 mb-4">
                  <img 
                    src={p.img} 
                    alt={p.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-extrabold text-indigo-500 tracking-wider bg-indigo-50 px-2.5 py-0.5 rounded-full">
                      {p.category}
                    </span>
                    <h3 className="font-extrabold text-slate-800 text-sm mt-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                      {p.name}
                    </h3>
                    
                    {/* Stars */}
                    <div className="flex items-center space-x-0.5 mt-1.5 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < p.rating ? 'fill-amber-400' : 'text-slate-200'}`} />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50">
                    <span className="font-black text-slate-900 text-base">
                      ${p.price.toFixed(2)}
                    </span>
                    <Link
                      to="/shop"
                      className="text-xs font-extrabold bg-slate-900 hover:bg-indigo-600 text-white px-4 py-2 rounded-full transition-all group-hover:shadow-md"
                    >
                      View Options
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* =========================================================
          NEWSLETTER & INTERACTIVE PROMOTIONAL BANNER
          ========================================================= */}
      <section className="relative bg-slate-900 rounded-3xl overflow-hidden py-16 px-8 md:px-16 flex flex-col lg:flex-row items-center justify-between z-10 shadow-2xl">
        {/* Animated background glowing spheres */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none select-none" />
        <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-80 h-80 rounded-full bg-purple-600/20 blur-3xl pointer-events-none select-none" />

        <div className="relative max-w-xl space-y-4 text-center lg:text-left z-10">
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Unlock 15% Off Your First Order
          </h2>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            Subscribe to our newsletter to receive access to new collections, exclusive drops, and secure custom offers.
          </p>
        </div>

        <div className="relative w-full max-w-md mt-8 lg:mt-0 z-10">
          <form className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full bg-white/10 border border-white/10 text-white placeholder-slate-400 rounded-full py-3 px-6 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all backdrop-blur-md"
              required
            />
            <button
              type="submit"
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-indigo-600/25 transition-all hover:scale-105 active:scale-95"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

    </div>
  );
};

export default Home;
