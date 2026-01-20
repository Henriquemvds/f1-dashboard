
     // ---- GERADOR DINÂMICO DE PÁGINAS ----
   export function getPageNumbers(currentPage, totalPages) {
    const pages = [];

    // Caso total de páginas seja 10 ou menos → Mostra todas
    if (totalPages <= 10) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    // Caso tenha mais de 10 páginas
    if (currentPage <= 6) {
      // está no início → mostra 1 até 10
      for (let i = 1; i <= 10; i++) {
        pages.push(i);
      }
      pages.push("last");
      return pages;
    }

    if (currentPage >= totalPages - 5) {
      // está no final → mostra últimas 10
      pages.push("first");
      for (let i = totalPages - 9; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    // Caso esteja no meio → exibe primeiro, "..." e intervalo dinâmico
    pages.push("first");

    const start = currentPage - 4;
    const end = currentPage + 4;

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    pages.push("last");

    return pages;
  }