import Breadcrums from '@/components/Breadcrums'
import ProductDesc from '@/components/ProductDesc'
import ProductImg from '@/components/ProductImg'
import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

const SingleProduct = () => {
    const params = useParams()
    const productId = params.id
    const { products } = useSelector(store => store.product)
    const product = products.find((item) => item._id === productId)
    // console.log(product);
    return (
        <div className="pt-16 sm:pt-20 lg:pt-25 px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">

            {/* Breadcrumb */}
            <Breadcrums product={product} />

            {/* Product Section */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">

                {/* Product Images */}
                <div className="w-full">
                    <ProductImg images={product.productImg} />
                </div>

                {/* Product Description */}
                <div className="w-full">
                    <ProductDesc product={product} />
                </div>

            </div>
        </div>
    )
}

export default SingleProduct