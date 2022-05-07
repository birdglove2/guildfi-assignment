import { Pagination } from '../../api/service/pagination';

it('should return correct pagination', () => {
  let pagination = Pagination.create(1, 10, 10);
  expect(pagination).toEqual({
    page: 1,
    limit: 10,
    prevPage: 1,
    nextPage: 1,
    totalPage: 1,
    totalItems: 10,
  });

  pagination = Pagination.create(10, 1, 10);
  expect(pagination).toEqual({
    page: 10,
    limit: 1,
    prevPage: 9,
    nextPage: 10,
    totalPage: 10,
    totalItems: 10,
  });

  pagination = Pagination.create(10, 10, 100);
  expect(pagination).toEqual({
    page: 10,
    limit: 10,
    prevPage: 9,
    nextPage: 10,
    totalPage: 10,
    totalItems: 100,
  });

  pagination = Pagination.create(5, 4, 100);
  expect(pagination).toEqual({
    page: 5,
    limit: 4,
    prevPage: 4,
    nextPage: 6,
    totalPage: 25,
    totalItems: 100,
  });

  pagination = Pagination.create(10, 10, 10);
  expect(pagination).toEqual({
    page: 1,
    limit: 10,
    prevPage: 1,
    nextPage: 1,
    totalPage: 1,
    totalItems: 10,
  });

  pagination = Pagination.create(10, 10, 0);
  expect(pagination).toEqual({
    page: 0,
    limit: 10,
    prevPage: -1,
    nextPage: 0,
    totalPage: 0,
    totalItems: 0,
  });
});
