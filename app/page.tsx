"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./hooks";
import { addToCart, removeFromCart, updateQuantity } from "@/features/cart/cartSlice";
import { fetchProducts } from "@/features/products/productsSlice";

const money = (value: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "USD" }).format(value);

export default function Home() {
  const dispatch = useAppDispatch();
  const { items: products, status, error } = useAppSelector((state) => state.products);
  const cart = useAppSelector((state) => state.cart.items);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    if (status === "idle") void dispatch(fetchProducts());
  }, [dispatch, status]);

  return (
    <main className="shop">
      <h1>Giỏ hàng Redux Toolkit</h1>
      <div className="columns">
        <section aria-labelledby="products-heading">
          <h2 id="products-heading">Sản phẩm</h2>
          {status === "loading" && <p>Đang tải sản phẩm...</p>}
          {status === "failed" && (
            <div role="alert">
              <p>{error}</p>
              <button onClick={() => void dispatch(fetchProducts())}>Thử lại</button>
            </div>
          )}
          {status === "succeeded" && (
            <div className="products">
              {products.map((product) => (
                <article className="product" key={product.id}>
                  <img src={product.thumbnail} alt={product.title} width={100} height={100} />
                  <div>
                    <h3>{product.title}</h3>
                    <p>{money(product.price)}</p>
                    <button onClick={() => dispatch(addToCart(product))}>Thêm vào giỏ</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
        <section aria-labelledby="cart-heading">
          <h2 id="cart-heading">Giỏ hàng ({cart.reduce((sum, item) => sum + item.quantity, 0)})</h2>
          {cart.length === 0 ? (
            <p>Giỏ hàng đang trống.</p>
          ) : (
            <>
              <ul className="cart-items">
                {cart.map((item) => (
                  <li key={item.id}>
                    <div>
                      <strong>{item.title}</strong>
                      <p>{money(item.price)} / sản phẩm</p>
                    </div>
                    <div className="cart-actions">
                      <label htmlFor={`quantity-${item.id}`}>Số lượng</label>
                      <input
                        id={`quantity-${item.id}`}
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(event) =>
                          dispatch(updateQuantity({ id: item.id, quantity: Number(event.target.value) }))
                        }
                      />
                      <button onClick={() => dispatch(removeFromCart(item.id))}>Xoá</button>
                    </div>
                    <p>Thành tiền: {money(item.price * item.quantity)}</p>
                  </li>
                ))}
              </ul>
              <p className="total">Tổng cộng: {money(total)}</p>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
