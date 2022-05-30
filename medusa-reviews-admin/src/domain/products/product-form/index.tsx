import * as React from "react"

import General from "./sections/general"
import Images from "./sections/images"
import Prices from "./sections/prices"
import RawJSON from "../../../components/organisms/raw-json"
import Reviews from "./sections/reviews"
import StockAndInventory from "./sections/stock-inventory"
import Variants from "./sections/variants"
import { useAdminStore } from "medusa-react"
import { useProductForm } from "./form/product-form-context"

type ProductFormProps = {
  product?: any
  isEdit?: boolean
}

const ProductForm = ({ product, isEdit = false }: ProductFormProps) => {
  const { isVariantsView } = useProductForm()
  const { store } = useAdminStore()
  const currencyCodes = store?.currencies.map((currency) => currency.code)

  return (
    <>
      <div>
        <General isEdit={isEdit} product={product} showViewOptions={!isEdit} />
      </div>
      {(isVariantsView || isEdit) && (
        <div className="mt-large">
          <Variants isEdit={isEdit} product={product} />
        </div>
      )}
      {!isVariantsView && !isEdit && (
        <div className="mt-large">
          <Prices
            currencyCodes={currencyCodes}
            defaultCurrencyCode={store?.default_currency_code}
            defaultAmount={1000}
          />
        </div>
      )}
      <div className="mt-large">
        <Images />
      </div>
      <div className="mt-large">
        <StockAndInventory />
      </div>
      <div className="mt-large">
        <Reviews id={product.id} />
      </div>
      <div className="mt-large">
        <RawJSON data={product} title="Raw product" />
      </div>
    </>
  )
}

export default ProductForm
