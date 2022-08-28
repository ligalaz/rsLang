import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import "./pagination.scss";

interface IPaginatedItemsProps {
  currentItems?: number[];
  itemsPerPage?: number;
  setPage?: any;
}

const items = new Array(20).fill(1).map((item, index) => (item = index + 1));

function Items({ currentItems }: IPaginatedItemsProps) {
  return (
    <>
      {currentItems &&
        currentItems.map((item, index) => <div key={index}></div>)}
    </>
  );
}

function PaginatedItems({ itemsPerPage, setPage }: IPaginatedItemsProps) {
  const [currentItems, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  console.log(+window.location.href.split("/")[6]);
  useEffect(() => {
    // Fetch items from another resources.
    const endOffset = itemOffset + itemsPerPage;
    console.log(`Loading items from ${itemOffset} to ${endOffset}`);
    setCurrentItems(items.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(items.length / itemsPerPage));
  }, [itemOffset, itemsPerPage]);

  // Invoke when user click to request another page.
  const handlePageClick = (event: any) => {
    const newOffset = (event.selected * itemsPerPage) % items.length;
    setPage(newOffset);
    console.log(
      `User requested page number ${event.selected}, which is offset ${newOffset}`
    );
    setItemOffset(newOffset);
  };

  return (
    <>
      <Items currentItems={currentItems} />
      <ReactPaginate
        breakLabel="..."
        nextLabel=">"
        previousLabel="<"
        onPageChange={handlePageClick}
        pageRangeDisplayed={1}
        pageCount={pageCount}
        renderOnZeroPageCount={null}
        containerClassName={"pagination"}
        pageClassName={"pagination__elem pagination__li"}
        pageLinkClassName={"pagination__a"}
        activeClassName={"pagination__elem pagination__active"}
        previousClassName={"pagination__elem pagination__arrow"}
        nextClassName={"pagination__elem pagination__arrow"}
        breakClassName={" pagination__elem pagination__break"}
        forcePage={+window.location.href.split("/")[6]}
      />
    </>
  );
}

export default PaginatedItems;
