self.__BUILD_MANIFEST = {
  "/": [
    "static/chunks/pages/index.js"
  ],
  "/artigo/[id]": [
    "static/chunks/pages/artigo/[id].js"
  ],
  "/piloto/[id]": [
    "static/chunks/pages/piloto/[id].js"
  ],
  "__rewrites": {
    "afterFiles": [],
    "beforeFiles": [],
    "fallback": []
  },
  "sortedPages": [
    "/",
    "/_app",
    "/_error",
    "/artigo/[id]",
    "/calendario",
    "/circuitos",
    "/guia",
    "/piloto/[id]",
    "/pilotos",
    "/resultados",
    "/sobre"
  ]
};self.__BUILD_MANIFEST_CB && self.__BUILD_MANIFEST_CB()