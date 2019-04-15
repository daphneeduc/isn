if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready) //permet de faire charger la page
} else {
    ready() //si la page n'a pas chargé on renvoie à une fonction qui va faire démarrer la page
}

function ready() {
    var supprimerCartItemButtons = document.getElementsByClassName('btn-danger') //création d'un bouton pour supprimer chaque produit du panier
    for (var i = 0; i < supprimerCartItemButtons.length; i++) { //permet de faire un bouton pour tous les produits du panier
        var button = supprimerCartItemButtons[i]
        button.addEventListener('click', supprimerCartItem) //permet qu'à chaque click sur le bouton l'action supprimer s'éxécute
    } //"addEventListener"est lié à une fonction et va exécuter la fonction l.80

    var quantityInputs = document.getElementsByClassName('cart-quantity-input') //on veut que le prix en fonction de la quantité s'actualise dans le panier
    for (var i = 0; i < quantityInputs.length; i++) { //la quantité ne peut pas être négative
        var input = quantityInputs[i] //variable que l'utilisateur rentre
        input.addEventListener('change', quantityChanged) //"addEventListener"est lié à une fonction va s'exécuter à chaque fois que la quantité change l.86
    }

    var addToCartButtons = document.getElementsByClassName('shop-item-button') //variable pour ajouter au panier liée aux élements "shop-item-button" dans la page html
    for (var i = 0; i < addToCartButtons.length; i++) { //même principe que pour les autres boutons
        var button = addToCartButtons[i]
        button.addEventListener('click', addToCartClicked) //quand l'utilisateur click sur le bouton on renvoit à une fonction l.94
    }

    document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked) //on crée un bouton pour le bouton ACHETER, lié à une fonction (l.72)
}

function purchaseClicked() {
  alert('Merci pour votre achat')
  var cartItems = document.getElementsByClassName('cart-items')[0]
  while (cartItems.hasChildNodes()) {
    cartItems.removeChild(cartItems.firstChild)
  }
  updateCartTotal()
}

function supprimerCartItem(event) { //fonction du bouton supprimer
    var buttonClicked = event.target
    buttonClicked.parentElement.parentElement.remove() //permet de supprimer tout l'element "parent", c'est à dire toute la division
    updateCartTotal() // fonction qui permet d'actualiser le panier une fois la suppression effectuée voir l.133
}

function quantityChanged(event) { //fonction pour la quantité
    var input = event.target
    if (isNaN(input.value) || input.value <= 0) { //on veut regarder si la valeur de la quantité est correcte, si c'est bien un nombre et on vérifie que ce nombre est positif
        input.value = 1 //valeur minimale pour la quantité et si l'utilisateur ne rentre pas un nombre, la quantité sera 1
    }
    updateCartTotal() // fonction qui permet d'actualiser le panier une fois la suppression effectuée voir l.133
}

function addToCartClicked(event) {
    var button = event.target
    var shopItem = button.parentElement.parentElement //on appelle la section du code html "shopItem"
    var title = shopItem.getElementsByClassName('shop-item-title')[0].innerText //faire afficher le titre de l'article dans le panier
    var price = shopItem.getElementsByClassName('shop-item-price')[0].innerText //faire afficher le prix de l'article dans le panier
    var imageSrc = shopItem.getElementsByClassName('shop-item-image')[0].src //faire afficher l'image de l'article dans le panier
    var id = shopItem.dataset.itemId
    addItemToCart(title, price, imageSrc, id)
    updateCartTotal()
}

function addItemToCart(title, price, imageSrc, id) { //fonction ajouter au panier
    var cartRow = document.createElement('div') //lié à la page html
    cartRow.classList.add('cart-row') //crée une liste avec tout ce qui est ajouté au panier
    cartRow.dataset.itemId = id
    var cartItems = document.getElementsByClassName('cart-items')[0] //initialisation des articles à 0
    var cartItemNames = cartItems.getElementsByClassName('cart-item-title') //on veut faire afficher le nom de l'article
    for (var i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText == title) { //on vérifie si l'article n'est pas déjà dans le panier donc si l'article que l'on rajoute a le même nom qu'un article déjà placé dans le panier
            alert('Ce produit a déjà été ajouté au panier.') // on fait afficher un message
            return
        }
    } //on veut que chaque article qui se rajoute au panier, et pa seulement le premier, se rajoute en dessous du premier article ajouté
  //on prend en compte tous les élements que l'on souhaite afficher :
    var cartRowContents = `
        <div class="cart-item cart-column">
            <img class="cart-item-image" src="${imageSrc}" width="100" height="100">
            <span class="cart-item-title">${title}</span>
        </div>
        <span class="cart-price cart-column">${price}</span>
        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" value="1">
            <button class="btn btn-danger" type="button">SUPPRIMER</button>
        </div>`
    cartRow.innerHTML = cartRowContents
    cartItems.append(cartRow)
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', supprimerCartItem) //sans mettre ce code, le bouton "supprimer" ne marche pas donc de la même manière que l.11
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged) //faire afficher la quantité pour chaque article même principe que l.17
}

function updateCartTotal() { //on va vouloir prendre en compte toutes les variables de chaque rangées(donc chaque article) pour savoir le prix et estimer le total
    var cartItemContainer = document.getElementsByClassName('cart-items')[0] //on appelle la section de la page html pour trouver les élements suivants
    var cartRows = cartItemContainer.getElementsByClassName('cart-row')
    var total = 0 //initalisation du total à 0
    for (var i = 0; i < cartRows.length; i++) { // prend en compte toutes les rangées donc tous les articles
        var cartRow = cartRows[i] //pour chaque rangée une par une
        var priceElement = cartRow.getElementsByClassName('cart-price')[0] // prend en compte le prix de chaque article dans chaque rangée
        var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0] //prend en compte la quantité demandée pour chaque article, chaque rangée
        var price = parseFloat(priceElement.innerText.replace('€', '')) // pour faire un calcul il faut enlever le signe € pour obtenir un nombre
  //"parseFloat" permet de prendre en compte le nombre en nombre décimal pour faire le calcul
        var quantity = quantityElement.value //on attribue la variable de la quantité à la valeur de l'élement quantité dans la rangée
        total = total + (price * quantity) //calcul pour obtenir le total
    }
    total = Math.round(total * 100) / 100 //obtenir un résultat arrondi
    document.getElementsByClassName('cart-total-price')[0].innerText = total + ' €'  //permet de faire afficher le résultat du calcul
}
