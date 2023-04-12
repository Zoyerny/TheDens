*User* : représente un utilisateur de votre application, avec des champs pour stocker l'identifiant, le nom d'utilisateur, l'e-mail, le mot de passe haché, le jeton de rafraîchissement haché, les dates de création et de mise à jour. L'utilisateur a des relations avec les projets, les messages de projet et les messages directs (envoyés et reçus).

*Project* : représente un projet dans votre application, avec des champs pour stocker l'identifiant, le nom, la description et les relations avec les utilisateurs et les messages du projet.

*ProjectUser* : représente la relation entre les utilisateurs et les projets, avec des champs pour stocker les identifiants des utilisateurs et des projets. Cela permet de gérer les projets auxquels un utilisateur participe.

*Message* : représente un message dans un projet, avec des champs pour stocker l'identifiant, le contenu, la date de création, l'identifiant de l'expéditeur et l'identifiant du projet. Les messages sont liés aux utilisateurs et aux projets.

*DirectMessage* : représente un message direct entre deux utilisateurs, avec des champs pour stocker l'identifiant, le contenu, la date de création, l'identifiant de l'expéditeur et l'identifiant du destinataire. Les messages directs sont liés aux utilisateurs.