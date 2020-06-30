module.exports = app => {
    const { existsOrError, notExistsOrError } = app.src.api.validation

    const save = (req, res) => {
        const adress = { ...req.body }
        if(req.params.id) adress.id = req.params.id
       
        try {
            existsOrError(adress.CEP, 'CEP não informado')
            existsOrError(adress.street, 'Nome da Rua não informado')
            existsOrError(adress.number, 'Número da casa não informado')
            existsOrError(adress.user_id, 'Id do Usuário não informado')
        } catch(msg) {
            res.status(400).send(msg)
        }

        if(adress.id) {
            app.database('adress')
                .update(adress)
                .where({ id: adress.id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.database('adress')
                .insert(adress)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const remove = async (req, res) => {
        try {
            existsOrError(req.params.id, 'Id do endereço não imformado.')

            const rowsDeleted= await app.database('adress')
                .where({id:req.params.id}).del()
            existsOrError(rowsDeleted,'Endereço a ser deletado não foi encontrado.')

            res.status(204).send()
        }catch(msg) {
            res.status(400).send(msg) 
        }    
    }

    const getByUser= async (req, res) => {
        const userId=req.params.id

        app.database({ a: 'adress',u: 'users'})
            .select('u.id','u.name', 'u.email',{ cep: 'a.CEP', street:'a.street', number:'a.number', complement:'a.complement', referencePoint:'a.reference' })
            .whereRaw('?? = ??', ['u.id','a.user_id'])
            .where({user_id:userId})
            .orderBy('a.id', 'cres')
            .then(adress => res.json(adress))
            .catch(err => res.status(500).send(err))
    }
    
    return { save, remove, getByUser}
}