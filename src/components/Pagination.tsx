"use client";

import { getPageNumbers } from "../data/Pagination.js";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
};

export default function Pagination({
  currentPage,
  totalPages,
  setCurrentPage,
}: PaginationProps) {
  return (
    <div className="pagination">
      {getPageNumbers(currentPage, totalPages).map((num, index) => {
        if (num === "first") {
          return (
            <button key={index} onClick={() => setCurrentPage(1)}>
              Primeira
            </button>
          );
        }

        if (num === "last") {
          return (
            <button key={index} onClick={() => setCurrentPage(totalPages)}>
              Última
            </button>
          );
        }

        return (
          <button
            key={index}
            onClick={() => setCurrentPage(num as number)}
            className={currentPage === num ? "active" : ""}
          >
            {num}
          </button>
        );
      })}
    </div>
  );
}
