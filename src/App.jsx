/* eslint-disable arrow-body-style */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
  const [query, setQuery] = useState('');
  const [selectedCategoriesId, setSelectedCategoriesId] = useState([]);

  const handleCategorySelecting = useCallback((id) => {
    if (!id) {
      setSelectedCategoriesId([]);

      return;
    }

    setSelectedCategoriesId(selectedCategoriesId.includes(id)
      ? selectedCategoriesId.filter(curId => curId !== id)
      : [...selectedCategoriesId, id]);
  });

  useEffect(() => {
    setProducts(rawProducts);
  }, []);

  const handleQueryChange = useCallback((event) => {
    setQuery(event.target.value);
  });

  const handleAllFilterReseting = useCallback(() => {
    setQuery('');
    selectUserId(0);
    setSelectedCategoriesId([]);
  }, []);

  const filterCatProducts = useMemo(() => {
    return userId
      ? products.filter(product => product.user.id === userId)
      : products;
  }, [userId, products]);

  const filterQueryProducts = useMemo(() => {
    return filterCatProducts.filter((product) => {
      return product.name.toLowerCase().includes(query.toLowerCase());
    });
  }, [filterCatProducts, query]);

  const filterCategories = useMemo(() => {
    if (selectedCategoriesId.length !== 0) {
      return filterQueryProducts.filter(product => (
        selectedCategoriesId.includes(product.categoryId)
      ));
    }

    return filterQueryProducts;
  }, [filterQueryProducts, selectedCategoriesId]);

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <Filters
            userId={userId}
            onUserSelect={selectUserId}
            query={query}
            onChangeQuery={handleQueryChange}
            users={usersFromServer}
            categories={categoriesFromServer}
            onResetFilter={handleAllFilterReseting}
            selectedCategories={selectedCategoriesId}
            onSelectCategory={handleCategorySelecting}
          />
        </div>

        <Table products={filterCategories} />
      </div>
    </div>
  );
};
