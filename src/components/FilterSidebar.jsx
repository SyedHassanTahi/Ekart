import React from 'react'
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useState } from "react"
import { Funnel, FunnelX } from 'lucide-react';

const FilterSidebar = ({ search, setSearch, category, setCategory, brand, setBrand, allProducts, priceRange, setPriceRange }) => {
  const Categories = allProducts.map(p => p.category)
  const [open, setOpen] = useState(false)
  const UniqueCategory = ["All", ...new Set(Categories)];
  // console.log(UniqueCategory)
  const Brands = allProducts.map(p => p.brand)
  // console.log(Brands)
  const UniqueBrands = ["All", ...new Set(Brands)];
  // console.log(UniqueBrands);


  const handleCategoryClick = (val) => {
    setCategory(val)
  }

  const handleBrandChange = (e) => {
    setBrand(e.target.value)
  }


  const handleMinChange = (e) => {
    const value = Number(e.target.value)
    if (value <= priceRange[1]) setPriceRange([value, priceRange[1]])
  }

  const handleMaxChange = (e) => {
    const value = Number(e.target.value)
    if (value >= priceRange[0]) setPriceRange([priceRange[0], value])
  }

  const restFilters = () => {
    setSearch("")
    setCategory("All")
    setBrand("All")
    setPriceRange([0, 999999])
  }
  return (
  
    <div className="mb-4 md:mb-0">
      {/* Mobile Toggle Button */}
      <div className="md:hidden flex justify-between items-center mb-2 ">
        <Button onClick={() => setOpen(!open)} className="bg-pink-600 text-white">
          {open ? <FunnelX /> : <Funnel />}
        </Button>
      </div>

      {/* Sidebar Content */}
      <div className={`${open ? "block" : "hidden"} md:block bg-gray-100 p-4 rounded-md h-max w-full md:w-64`}>

        {/* Search */}
        <Input
          type='text'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder='Search...'
          className='bg-white p-2 rounded-md border-gray-400 border-2 w-full'
        />

        {/* Category */}
        <h1 className='mt-5 font-semibold text-xl'>Category</h1>
        <div>
          {UniqueCategory.map((item, index) => (
            <div key={index} className='flex items-center gap-2'>
              <input
                type="radio"
                checked={category === item}
                onChange={() => handleCategoryClick(item)}
              />
              <label>{item}</label>
            </div>
          ))}
        </div>

        {/* Brands */}
        <h1 className='mt-5 font-semibold text-xl'>Brand</h1>
        <select
          value={brand}
          onChange={handleBrandChange}
          className='bg-white w-full p-2 border-gray-200 border-2 rounded-md'
        >
          {UniqueBrands.map((item, index) => (
            <option key={index} value={item}>{item.toUpperCase()}</option>
          ))}
        </select>

        {/* Price Range */}
        <h1 className='mt-5 font-semibold text-xl mb-3'>Price Range</h1>
        <div className='flex flex-col gap-2'>
          <label>Price Range: ${priceRange[0]} - ${priceRange[1]}</label>
          <div className='flex gap-2 items-center'>
            <input type="number" value={priceRange[0]} onChange={handleMinChange} min='0' max='5000' className='w-20 p-1 border border-gray-300 rounded' />
            <span>-</span>
            <input type="number" value={priceRange[1]} onChange={handleMaxChange} min='0' max='999999' className='w-20 p-1 border border-gray-300 rounded' />
          </div>
          <input type="range" value={priceRange[0]} onChange={handleMinChange} min='0' max='5000' className='w-full' />
          <input type="range" value={priceRange[1]} onChange={handleMaxChange} min='0' max='999999' className='w-full' />
        </div>

        {/* Reset Button */}
        <Button onClick={restFilters} className='bg-pink-600 text-white mt-5 w-full'>
          Reset Filters
        </Button>
      </div>
    </div>
  )
}
export default FilterSidebar
