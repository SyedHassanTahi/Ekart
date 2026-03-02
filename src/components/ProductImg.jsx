import React, { useState } from 'react'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

const ProductImg = ({ images }) => {
  const [mainImg, setMainImg] = useState(images[0].url)
  return (
  
    <div className="flex flex-col lg:flex-row gap-6 w-full">

      {/* Thumbnails */}
      <div className="flex lg:flex-col gap-4 order-2 lg:order-1 overflow-x-auto lg:overflow-visible">
        {
          images.map((img, index) => (
            <img
              key={index}
              onClick={() => setMainImg(img.url)}
              src={img.url}
              alt=""
              className="cursor-pointer w-16 h-16 sm:w-20 sm:h-20 object-cover border shadow-md rounded-md shrink-0"
            />
          ))
        }
      </div>

      {/* Main Image */}
      <div className="order-1 lg:order-2 w-full">
        <Zoom>
          <img
            src={mainImg}
            alt=""
            className="w-full max-w-md lg:max-w-lg xl:max-w-xl border shadow-lg rounded-lg object-contain"
          />
        </Zoom>
      </div>

    </div>
  )
}

export default ProductImg