//const modelsSauce = require('../models/modelsSauce');
const Sauce = require('../models/modelsSauce');

exports.sauceLike = (req, res, next) => {
    console.log("je suis dans le controller like !");

    //affichage req.body 

    console.log("CONTENU req.body - ctrllikes");
    console.log(req.body);

    //récupérer id dans l'url de la requête
    console.log("CONTENU req.body - ctrllikes");
    console.log(req.params);

    //mise au format de l'id pour objet correspondant basededonnée
    console.log(" id en _id ");
    console.log({ _id: req.params.id });

    //aller chercher objet dans base de données

    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            console.log("--> CONTENU resultat promise : ", sauce)

            //mise en place d'un switch case
            switch(req.body.like){
                case 1 :
            //like = 1 (likes + 1)
            // si l'userLike est false et si like ===1
            if (!sauce.usersLiked.includes(req.body.userId) && req.body.like === 1) {
                //MAJ base de donnée
                Sauce.updateOne(
                    { _id: req.params.id },
                    {
                        $inc: { likes: 1 },
                        $push: { usersLiked: req.body.userId }
                    }
                )
                    .then(() => res.status(201).json({ message: "Sauce like +1" }))
                    .catch((error) => res.status(400).json({ error }));
            }
            break;
                
            case -1:
            //like = -1 (dislikes = +1)
                 if (!sauce.usersDisliked.includes(req.body.userId) && req.body.like === -1) {
                    //MAJ base de donnée
                    Sauce.updateOne(
                        { _id: req.params.id },
                        {
                            $inc: { dislikes: 1 },
                            $push: { usersDisliked: req.body.userId }
                        }
                    )
                        .then(() => res.status(201).json({ message: "Sauce Dislike +1" }))
                        .catch((error) => res.status(400).json({ error }));
                }
                break;

                case 0:
                    //like = 0 (likes = 0, pas de vote)
                    if(sauce.usersLiked.includes(req.body.userId)){ 
                            //MAJ base de donnée
                            Sauce.updateOne(
                                { _id: req.params.id },
                                {
                                    $inc: { likes: -1 },
                                    $pull: { usersLiked: req.body.userId }
                                }
                            )
                                .then(() => res.status(201).json({ message: "Sauce like 0" }))
                                .catch((error) => res.status(400).json({ error }));
                        };
                        if (sauce.usersDisliked.includes(req.body.userId)){
                            
                                //MAJ base de donnée
                                Sauce.updateOne(
                                    { _id: req.params.id },
                                    {
                                        $inc: { dislikes: -1 },
                                        $pull: { usersDisliked: req.body.userId },
                                    }
                                )
                                    .then(() => res.status(201).json({ message: "Sauce like 0" }))
                                    .catch((error) => res.status(400).json({ error }));
                            }
                            break;
                    }
            })
        .catch((error) => res.status(404).json({ error }))
    //like = 0 (dislikes = 0 )
}