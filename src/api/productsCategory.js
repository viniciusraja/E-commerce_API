module.exports = (app) => {
  const { existsOrError, notExistsOrError } = app.src.api.validation;

  const save = (req, res) => {
    const category = { ...req.body };
    if (req.params.id) category.id = req.params.id;

    try {
      existsOrError(
        category.title,
        "Nome da Categoria do produto não informada"
      );
    } catch (msg) {
      res.status(400).send(console.log(msg));
    }

    if (category.id) {
      app
        .database("categories")
        .update(category)
        .where({ id: category.id })
        .then((_) => res.status(204).send())
        .catch((err) => res.status(500).send(err));
    } else {
      app
        .database("categories")
        .insert(category)
        .then((_) => res.status(204).send())
        .catch((err) => res.status(500).send(err));
    }
  };

  const remove = async (req, res) => {
    try {
      existsOrError(req.params.id, "Código da Categoria não imformado.");

      const categoriesProducts = await app
        .database("products")
        .where({ category_id: req.params.id });
      notExistsOrError(
        categoriesProducts,
        "Esta Categoria possui Produtos, delete-os primeiro!"
      );

      const rowsDeleted = await app
        .database("categories")
        .where({ id: req.params.id })
        .del();
      existsOrError(
        rowsDeleted,
        "Categoria a ser deletada não foi encontrada."
      );

      res.status(204).send();
    } catch (msg) {
      res.status(400).send(console.log(msg));
    }
  };

  const get = async (req, res) => {
      try{
      const categories = await app
      .database("categories")
      .orderBy("categories.id", "cres")
      .catch((err) => res.status(500).send(err));
     
      const categoriesList=categories.map(async (item) => {
          try{
              const products= await app
          .database("categories")
          .select(
          "p.id",
          "p.name",
          "p.price",
          "p.ingredients_details",
          "p.allergic_information",
          "i.url",
          {
              imageId: "i.id",
              categoryId: "c.id",
            })
            .from({ c: "categories" })
            .leftJoin({ p: "products" }, "p.category_id", "c.id")
            .leftJoin({ i: "product_image" }, "i.product_id", "p.id")
            .where({ category_id: item.id })
            .orderBy("p.id", "cres")
            .catch((err) => res.status(500).send(err));
                return {
                    ...item,
                    productsList:products
                }
        }catch(error){res.status(400).send(msg);}
        });
        Promise.all(categoriesList)
            .then(categoriesList=>res.json(categoriesList))
            .catch((error)=>res.status(500).send(error))
    }catch(error){res.status(400).send(msg);}
    };

  const getById = (req, res) => {
    app
      .database("categories")
      .where({ id: req.params.id })
      .first()
      .then((category) => {
        res.json(category);
      })
      .catch((err) => res.status(500).send(err));
  };

  return { save, remove, get, getById };
};
