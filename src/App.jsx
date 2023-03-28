/* eslint-disable arrow-body-style */
import React, { useEffect, useMemo, useState } from 'react';
import './App.scss';
import { Filters } from './components/Filters';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';
import { Table } from './components/Table';

const rawProducts = productsFromServer.map((product) => {
  const category = categoriesFromServer
    .find(cat => product.categoryId === cat.id);
  const user = usersFromServer
    .find(us => us.id === category.ownerId); // find by category.ownerId

  return {
    ...product,
    category,
    user,
  };
});

export const App = () => {
  const [userId, selectUserId] = useState(0);
  const [products, setProducts] = useState(rawProducts);

  useEffect(() => {
    setProducts(rawProducts);
  }, []);

  const preparedProducts = useMemo(() => {
    return userId
      ? products.filter(product => product.user.id === userId)
      : products;
  }, [userId]);

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <Filters
            userId={userId}
            onUserSelect={selectUserId}
            users={usersFromServer}
            categories={categoriesFromServer}
          />
        </div>

        <Table products={preparedProducts} />
      </div>
    </div>
  );
};
