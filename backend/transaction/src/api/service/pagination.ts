export interface PaginationAttrs {
  page: number;
  limit: number;
  prevPage: number;
  nextPage: number;
  totalPage: number;
  totalItems: number;
}

const defaultPage = 1;
const defaultLimit = 10;

export class Pagination {
  /**
   *
   * @param page page
   * @param limit number to render per page
   * @param totalItems number of all items retrieve from database
   */
  public static create(page: number, limit: number, totalItems: number): PaginationAttrs {
    const totalPage = Math.ceil(totalItems / limit);

    if (page > totalPage) {
      page = totalPage;
    }

    const nextPage = page === totalPage ? totalPage : page + 1;
    const prevPage = page === 1 ? page : page - 1;

    return {
      page,
      limit,
      totalItems,
      prevPage,
      nextPage,
      totalPage,
    };
  }

  /**
   * parse string to number from req.body
   * if page and limit stay in default value
   * else return default value
   * @param page
   * @param limit
   * @returns object of page and limit in number type
   */
  public static clean(page?: string, limit?: string) {
    if (!page || +page <= 0) {
      page = defaultPage.toString();
    }

    if (!limit || +limit < 10) {
      limit = defaultLimit.toString();
    } else if (+limit > 100) {
      limit = '100';
    }

    return { p: +page, l: +limit };
  }
}
