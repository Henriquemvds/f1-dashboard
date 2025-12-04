import { getPageNumbers } from "../data/Pagination.js";


export default function Pagination({ currentPage, totalPages, setCurrentPage}) {
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
                        onClick={() => setCurrentPage(num)}
                        className={currentPage === num ? "active" : ""}
                      >
                        {num}
                      </button>
                    );
                  })}
      
                </div>
      
    );
}