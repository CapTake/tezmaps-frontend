export const tzrc20CommandType = {
  prim: "or",
  args: [
    {
      prim: "pair",
      annots: ["%deploy"],
      args: [
        {
          prim: "string",
          annots: ["%tick"],
        },
        {
          prim: "nat",
          annots: ["%max"],
        },
        {
          prim: "nat",
          annots: ["%lim"],
        },
        {
          prim: "nat",
          annots: ["%dec"],
        },
        {
          prim: "nat",
          annots: ["%cd"],
        },
        {
          prim: "timestamp",
          annots: ["%nbf"],
        },
        {
          prim: "timestamp",
          annots: ["%exp"],
        },
      ],
    },
    {
      prim: "pair",
      annots: ["%mint"],
      args: [
        {
          prim: "string",
          annots: ["%tick"],
        },
        {
          prim: "nat",
          annots: ["%amt"],
        },
      ],
    },
  ],
};
