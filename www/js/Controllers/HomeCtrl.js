function HomeCtrl($rootScope, $scope, $http, $store, $location) {

	// $rootScope.rootUrl = "http://m.completel.com/apiticketrest/";
	$rootScope.rootUrl = "http://www.proxiad-axe-seine.com/apiticketrest/";

	$scope.globalTimeout = 60000;

	$scope.loader = false;
	$scope.panel = 2;

	$scope.dev = false;

	$scope.userId;

	$scope.ticketsList = "";

	// Listes des tickets
	$scope.ticketsListOuverts = [];
	$scope.ticketsListGeles = [];
	$scope.ticketsListClos = [];
	$scope.ticketsListResolus = [];

	// Recerche ticket
	$scope.categorieRechercheTicket = 1;
	$scope.cbClosRechercheTicket = false;
	$scope.cbOuvertRechercheTicket = true;
	$scope.cbGeleRechercheTicket = true;
	$scope.cbResoluRechercheTicket = false;
	$scope.societeRechercheTicket = 1;
	$scope.numeroTicketRechercheTicket = "";
	$scope.prioriteRechercheTicket = 1;
	$scope.proActiviteRechercheTicket = false;
	$scope.refClientRechercheTicket = "";

	// Création ticket
	$scope.categorieNouveauTicket = 1;
	$scope.referenceNouveauTicket = "";
	$scope.siteNouveauTicket = "";
	$scope.numeroTicketNouveauTicket = "";
	$scope.nomNouveauTicket = "";
	$scope.telNouveauTicket = "";
	$scope.signalisationNouveauTicket = 1;
	$scope.equipementsRedemarresNouveauTicket = false;
	$scope.symptomesNouveauTicket = "";

	$scope.ticketId = "";

	$scope.currentTicket;

	// Création action
	$scope.typeNouvelleAction = 1;
	$scope.commentaireNouvelleAction;

	// Recherche clients
	$scope.loginRechercheClient = "";
	$scope.nomRechercheClient = "";
	$scope.prenomRechercheClient = "";
	$scope.societeRechercheClient = 1;
	$scope.utilisateurRechercheClient = 1;

	$scope.searchUsersList = [];

	$scope.logout = function() {
		$scope.loader = true;

		redirectionToConnexion();

		$scope.loader = false;
	}

	$scope.init = function() {
		$scope.userId = $store.get("userId");
		$scope.panel = 2;

		$scope.loadTickets();
	}

	function redirectionToConnexion() {
		$location.path('/connexion')
	}


	$scope.searchTicketsReset = function() {
		$scope.loader = true;
		$scope.categorieRechercheTicket = 1;
		$scope.cbClosRechercheTicket = false;
		$scope.cbOuvertRechercheTicket = true;
		$scope.cbGeleRechercheTicket = true;
		$scope.cbResoluRechercheTicket = false;
		$scope.societeRechercheTicket = 1;
		$scope.numeroTicketRechercheTicket = "";
		$scope.prioriteRechercheTicket = 1;
		$scope.proActiviteRechercheTicket = false;
		$scope.refClientRechercheTicket = "";
		$scope.loaderRechercheTicket = false;

		$scope.loader = false;
	}

	$scope.searchClientReset = function() {
		$scope.loader = true;
		$scope.loginRechercheClient = "";
		$scope.nomRechercheClient = "";
		$scope.prenomRechercheClient = "";
		$scope.societeRechercheClient = 1;
		$scope.utilisateurRechercheClient = 1;
		$scope.loader = false;
	}

	$scope.loadTickets = function() {
		$scope.loader = true;

		var typeUtilisateur = $store.get("typeUtilisateur");

		if ((typeUtilisateur == "accestotal") || (typeUtilisateur == "adminnet")) {
			$scope.panel = -1;
			$scope.loader = false;
		} else {
			loadTicketsForClient();

			// addTicketsToStoreAndFillTicketLists();
		}
	}

	function addTicketsToStoreAndFillTicketLists() {

		for (var i = 0; i < $scope.ticketsList.length; i++) {
			$currentTicket = $scope.ticketsList[i];
			$store.set($currentTicket.noTicket, $currentTicket);

			if ($currentTicket.etat == "ouvert") {
				$scope.ticketsListOuverts.push($currentTicket);			
			}

			if ($currentTicket.etat == "gele") {
				$scope.ticketsListGeles.push($currentTicket);			
			}

			if ($currentTicket.etat == "clos") {
				$scope.ticketsListClos.push($currentTicket);			
			}

			if ($currentTicket.etat == "resolu") {
				$scope.ticketsListResolus.push($currentTicket);			
			}
		}
	}

	$scope.searchTicketsSubmit = function() {
		$scope.loader = true;

		if ($scope.dev) {
			createAlertMessage("La requete a bien été enregistrée, les tickets seront affichés ici.");
			$scope.loader = false;
		} else {
			var url = $rootScope.rootUrl + "ticket?";

			var base64Encoded = $rootScope.loginHeader;

			if ($scope.categorieRechercheTicket) {
				url = url + "categorie=" + $scope.categorieRechercheTicket + "&";
			}

			if ($scope.cbClosRechercheTicket) {
				url = url + "clos=" + $scope.cbClosRechercheTicket + "&";
			}

			if ($scope.cbOuvertRechercheTicket) {
				url = url + "ouvert=" + $scope.cbOuvertRechercheTicket + "&";
			}

			if ($scope.cbGeleRechercheTicket) {
				url = url + "gele=" + $scope.cbGeleRechercheTicket + "&";
			}

			if ($scope.cbResoluRechercheTicket) {
				url = url + "resolu=" + $scope.cbResoluRechercheTicket + "&";
			}

			if ($scope.societeRechercheTicket) {
				url = url + "societe=" + $scope.societeRechercheTicket + "&";
			}

			if ($scope.numeroTicketRechercheTicket) {
				url = url + "numeroTicket=" + $scope.numeroTicketRechercheTicket + "&";
			}

			if ($scope.prioriteRechercheTicket) {
				url = url + "priorite=" + $scope.prioriteRechercheTicket + "&";
			}

			if ($scope.proActiviteRechercheTicket) {
				url = url + "proActivite=" + $scope.proActiviteRechercheTicket + "&";
			}

			if ($scope.refClientRechercheTicket) {
				url = url + "refClient=" + $scope.refClientRechercheTicket;
			}


			$http.get(url, {headers: {'Authorization': 'Basic ' + base64Encoded}, timeout: $scope.globalTimeout}).success(ticketSearchSuccess).error(httpError);
		}
	}

	ticketSearchSuccess =  function(data, status, headers, config) {
		$scope.panel = 2;

		$scope.ticketsList = data.ticketRetour;

		addTicketsToStoreAndFillTicketLists();

		$scope.loader = false;
	}

	$scope.createTicketSubmitStep1 = function() {
		$scope.loader = true;

		if ($scope.dev) {
			createAlertMessage("La vérification du site ou de la référence se fera ici.");
			$scope.loader = false;
			$scope.panel = 4.5;
		} else  if ($scope.categorieNouveauTicket == 1) { // Technique
			var url = $rootScope.rootUrl + "cls/" + $scope.referenceNouveauTicket ;
			var base64Encoded = $rootScope.loginHeader;

			// $http.get(url, {headers: {'Authorization': 'Basic ' + base64Encoded}, timeout: $scope.globalTimeout}).success(createTicketStep1Success).error(createTicketStep1ReferenceError);
			// TODO uncomment this when ws is created

			$scope.loader = false;
			$scope.panel = 4.5;

		} else if ($scope.categorieNouveauTicket == 2) { // Administratif

			var url = $rootScope.rootUrl + "recherche/sites?libelle=" + $scope.siteNouveauTicket;
			var base64Encoded = $rootScope.loginHeader;

			// $http.get(url, {headers: {'Authorization': 'Basic ' + base64Encoded}, timeout: $scope.globalTimeout}).success(createTicketStep1Success).error(createTicketStep1SiteError);
			// TODO uncomment this when ws is created
			$scope.loader = false;
			$scope.panel = 4.5;
		} else {
			alert('Veuillez selectionner une catégorie.');

		}
	}

	createTicketStep1Success = function(data, status, headers, config) {


		$scope.loader = false;
		$scope.panel = 4.5;
	}

	createTicketStep1SiteError =  function(data, status, headers, config) {
		alert("Ce site est introuvable.");
		$scope.loader = false;
	}

	createTicketStep1ReferenceError =  function(data, status, headers, config) {
		alert("Cette référence est introuvable.");
		$scope.loader = false;
	}

	$scope.createTicketSubmitStep2 = function() {
		$scope.loader = true;
		// createAlertMessage("La création du ticket été enregistrée... L'appel au Web Service sera fait ici. <br/> Valeur entrées : <br/>	Categorie : " + $scope.categorieNouveauTicket + "<br/>Reference : " + $scope.referenceNouveauTicket + "<br/>N° ticket : " + $scope.numeroTicketNouveauTicket + "<br/>Nom : " + $scope.nomNouveauTicket + "<br/>Tel : " + $scope.telNouveauTicket + "<br/>Signalisation : " + $scope.signalisationNouveauTicket + "<br/>Equipements redémarrés : " + $scope.equipementsRedemarresNouveauTicket + "<br/>Symptomes : " + $scope.symptomesNouveauTicket);

		if ($scope.dev) {
			createAlertMessage("Le ticket sera créé ici.");
			$scope.panel = 2;
			$scope.loader = false;	

		} else {
			var url = $rootScope.rootUrl + "ticket?";

			var base64Encoded = $rootScope.loginHeader;

			if ($scope.categorieNouveauTicket) {
				url = url + "categorie=" + $scope.categorieNouveauTicket + "&";
			}

			if ($scope.referenceNouveauTicket) {
				url = url + "reference=" + $scope.referenceNouveauTicket + "&";
			}

			if ($scope.numeroTicketNouveauTicket) {
				url = url + "numeroTicket=" +$scope.numeroTicketNouveauTicket + "&";
			}

			if ($scope.signalisationNouveauTicket) {
				url = url + "nom=" +$scope.signalisationNouveauTicket + "&";
			}

			if ($scope.telNouveauTicket) {
				url = url + "tel=" + $scope.telNouveauTicket + "&";
			}

			if ($scope.signalisationNouveauTicket) {
				url = url + "signalisation=" + $scope.signalisationNouveauTicket + "&";
			}

			if ($scope.equipementsRedemarresNouveauTicket) {
				url = url + "equipementsRedemarres=" + $scope.equipementsRedemarresNouveauTicket + "&";
			}

			if ($scope.symptomesNouveauTicket) {
				url = url + "symptome=" + $scope.symptomesNouveauTicket + "&";
			}

			$http.put(url, {headers: {'Authorization': 'Basic ' + base64Encoded}, timeout: $scope.globalTimeout}).success(createTicketSuccess).error(httpError);

		}	
	}

	$scope.createTicketSubmit = function() {

	}

	createTicketSuccess =  function(data, status, headers, config) {
		
		$ticket = data.ticketRetour;
		$store.set($ticket.noTicket, $ticket);
		$scope.currentTicket = $ticket;

		$scope.panel = 5;
		scope.loader = false;	
	}

	$scope.createActionSubmit = function() {
		$scope.loader = true;
		if ($scope.dev) {
			createAlertMessage("La création de l'action été enregistrée... L'appel au Web Service sera fait ici. <br/> Valeur entrées : <br/>	Type : " + $scope.typeNouvelleAction + "<br/>Commentaire : " + $scope.commentaireNouvelleAction);
			$scope.loader = false;		
		} else {
			var url = $rootScope.rootUrl + "ticket/" + $scope.ticketId + "/action";

			if ($scope.typeNouvelleAction) {
				url = url + "type=" + $scope.typeNouvelleAction + "&";
			}

			if ($scope.commentaireNouvelleAction) {
				url = url + "commentaire=" +  $scope.commentaireNouvelleAction;
			}

			var base64Encoded = $rootScope.loginHeader;
			$http.put(url, {headers: {'Authorization': 'Basic ' + base64Encoded}, timeout: $scope.globalTimeout}).success(createActionSuccess).error(httpError);


		}
	}

	createActionSuccess = function(data, status, headers, config) {
		$scope.panel = 5;
		$scope.loader = false;		
	}

	$scope.searchClientSubmit = function() {
		$scope.loader = true;

		loadClientsAfterSearch();

		if ($scope.dev) {
			$scope.searchUsersList = angular.fromJson('[{"prenom" : "Robert","nom" : "Dupond","email" : "robert.dupond@test.com","type_utilisateur" : "Gestionnaire"},{"prenom" : "José","nom" : "Dalle","email" : "j.dalle@chezjose.com","type_utilisateur" : "Utilisateur"},{"prenom" : "Maurice","nom" : "Roulé","email" : "maurice.roulé@proxiad.com","type_utilisateur" : "Administrateur"} ] ');
			$scope.panel = -2;
			$scope.loader = false;	
		} else {
			var base64Encoded = $rootScope.loginHeader;

			var ouvertUrl = $rootScope.rootUrl + "recherche/clients";
			if ($scope.loginRechercheClient) {
				url = url + "login=" + $scope.loginRechercheClient + "&";
			}

			if ($scope.nomRechercheClient) {
				url = url + "nom=" +  $scope.nomRechercheClient + "&";
			}

			if ($scope.prenomRechercheClient) {
				url = url + "prenom=" +  $scope.prenomRechercheClient + "&";
			}

			if ($scope.societeRechercheClient) {
				url = url + "societe=" +  $scope.societeRechercheClient + "&";
			}

			if ($scope.utilisateurRechercheClient) {
				url = url + "type-utilisateur=" +  $scope.utilisateurRechercheClient + "&";
			}

			$http.get(ouvertUrl,{headers: {'Authorization': 'Basic ' + base64Encoded}, timeout : $scope.globalTimeout}).success(loadClientsSuccess).error(httpError);

		}
	}

	loadClientsSuccess = function(data, status, headers, config) {
		$scope.searchUsersList = data;
		$scope.panel = -2;
		$scope.loader = false;	
	}

	$scope.isAdmin = function($user) {
		return $user.type_utilisateur=='Administrateur';
	}

	$scope.isGestionnaire = function($user) {
		return $user.type_utilisateur=='Gestionnaire';
	}

	$scope.isUtilisateur = function($user) {
		return $user.type_utilisateur=='Utilisateur';
	}

	$scope.ticketDetails = function(e) {
		$scope.loader = true;
		$elem = $(e.currentTarget);

		var elemId = $elem.find('.ticketId').val();

		$scope.ticketId = elemId;

		if ($scope.dev) {

			$scope.panel = 5;
			$scope.loader = false;

			setTimeout(function()
			{
				checkChevrons();
			}, 1000);
		} else {

			var base64Encoded = $rootScope.loginHeader;

			var ouvertUrl = $rootScope.rootUrl + "ticket/infos/" + $scope.ticketId;
			$http.get(ouvertUrl,{headers: {'Authorization': 'Basic ' + base64Encoded}, timeout : $scope.globalTimeout}).success(loadTicketDetailsSuccess).error(httpError);

		}


	}

	loadTicketDetailsSuccess = function(data, status, headers, config) {
		$scope.currentTicket = data.ticket;

		$store.set($scope.ticketId, data.ticket);
		$scope.panel = 5
		$scope.loader = false;
		setTimeout(function()
		{
			checkChevrons();
		}, 1000);
	}


	function checkChevrons() {
		$('.actionCommentaireClass').each(function () {
			if (this.clientWidth >= this.scrollWidth) {
				$(this).siblings('.arrowGlyphDiv').remove();

				$(this).parent().removeAttr('ng-click');
			}

		});
	}

	$scope.actionDetails = function(e) {
		$elem = $(e.currentTarget);

		if ($elem.find('.actionCommentaire').length) {
			$('#actionTab .arrowGlyphDiv span').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
			$("#actionTab .actionRow ").css('height', '60px');

			$('#actionTab .actionCommentaireClass').addClass('actionCommentaire').removeClass('actionCommentaireExpanded')

			$elem.find('.arrowGlyphDiv span').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
			$elem.find('.actionCommentaireClass').addClass('actionCommentaireExpanded').removeClass('actionCommentaire')
			$elem.css('height', 'auto');
		} else {
			$elem.find('.arrowGlyphDiv span').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
			$elem.find('.actionCommentaire').show();;
			$elem.find('.actionCommentaireClass').addClass('actionCommentaire').removeClass('actionCommentaireExpanded')
			$elem.css('height', '60px');
		}

	}

	httpSuccess = function(response) {
		$scope.loader = false;
		createAlertMessage("Informations recues avec succès, il faut maintenant vérifier si la connexion a été un succès.");


	}

	httpError = function(data, status, headers, config) {

		switch(status) {
			case 401:
			createAlertMessage("Identifiants ou mot de passe érronés.");
			break;
			case 500:
			createAlertMessage("Erreur interne de serveur.");
			break;
			case 0 : 
			createAlertMessage("Une erreur est survenue");
			break;
			default :
			createAlertMessage("Une erreur est survenue.");
		}
		$scope.loader = false;
	}

	function loadTicketsForClient(){
		$scope.loader = true;

		if ($scope.dev) {
			$scope.ticketsList = angular.fromJson('[{"etat" : "ouvert","noTicket" : "1","dateAppel" : 1383217200,"reference" : "2","societe" : "societe 1","refTicketClient" : "3","dateCloture" : "","signalisation" : "signalisation 1","categorie" : "categorie 1","symptome" : "symptome court","site" : "site 1","siteBarre" : "site barre 1","priorite" : "priorite 1","proactivite" : true,"dateModificationAT" : 1383237200,"actions" : [{		"date" : 1383217200,		"commentaire" : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nec porttitor ante. Curabitur vitae aliquet dui. Aliquam erat volutpat. Fusce pharetra blandit erat id bibendum. Maecenas accumsan semper aliquet. Vivamus vulputate feugiat eros sit amet suscipit. Suspendisse nec mollis metus. Interdum et malesuada fames ac ante ipsum primis in faucibus.  Sed eu lacus convallis, imperdiet quam in, luctus velit. Nullam non eleifend lectus. Integer vel mauris eu quam venenatis scelerisque. Curabitur rutrum mollis feugiat. Quisque commodo neque et dolor dictum iaculis. Pellentesque eu lectus ac urna tempus aliquet. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.  Maecenas adipiscing, leo ac pretium sodales, tellus tellus blandit felis, sit amet adipiscing massa eros non tellus. Mauris vehicula sem vel turpis gravida, vehicula eleifend mauris consequat. Donec tincidunt eros nec dui scelerisque posuere. Nulla porttitor accumsan magna gravida pulvinar. Maecenas fringilla eleifend libero nec viverra. Etiam at libero sit amet metus consequat condimentum sit amet non tortor. Proin quis tortor eu risus ornare tristique et non nisi. In non nunc a erat vulputate aliquet eu ac est. Praesent sit amet ultricies eros, porttitor molestie justo.  Nulla a nunc libero. Nullam porttitor lacinia consequat. Quisque vitae porttitor est. Nulla facilisi. Quisque posuere justo nec est ultrices, facilisis vulputate turpis pulvinar. Curabitur sed congue tortor, sit amet bibendum lorem. Proin felis sapien, venenatis ultrices lorem sit amet, sollicitudin feugiat nisi. Nam porta malesuada aliquet. Curabitur laoreet arcu varius tellus pretium dignissim. In volutpat laoreet sem, sed sagittis velit. Donec non justo quam. Suspendisse nisl velit, rhoncus vitae fringilla sed, dignissim quis arcu. Aenean dignissim elit at sapien tincidunt laoreet.  Maecenas scelerisque, arcu sed posuere auctor, velit purus lobortis odio, quis eleifend dolor dolor eu dui. Morbi volutpat tristique velit, a tempor libero mollis ullamcorper. Cras vestibulum sollicitudin tempus. Donec pulvinar a nunc ut luctus. Morbi cursus metus erat, eu eleifend sem mattis sed. Pellentesque porttitor felis ut nunc pharetra, ut fermentum sapien pretium. Cras eu felis nulla. Cras quis elementum arcu. Proin lacinia velit sed scelerisque scelerisque. Vivamus vel mauris ut metus viverra tempor non ac risus. "	}, {		"date" : 1483217200,		"commentaire" : "com 1.2"	}, {		"date" : 1583217200,		"commentaire" : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nec porttitor ante. Curabitur vitae aliquet dui. Aliquam erat volutpat. Fusce pharetra blandit erat id bibendum. Maecenas accumsan semper aliquet. Vivamus vulputate feugiat eros sit amet suscipit. Suspendisse nec mollis metus. Interdum et malesuada fames ac ante ipsum primis in faucibus.  Sed eu lacus convallis, imperdiet quam in, luctus velit. Nullam non eleifend lectus. Integer vel mauris eu quam venenatis scelerisque. Curabitur rutrum mollis feugiat. Quisque commodo neque et dolor dictum iaculis. Pellentesque eu lectus ac urna tempus aliquet. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.  Maecenas adipiscing, leo ac pretium sodales, tellus tellus blandit felis, sit amet adipiscing massa eros non tellus. Mauris vehicula sem vel turpis gravida, vehicula eleifend mauris consequat. Donec tincidunt eros nec dui scelerisque posuere. Nulla porttitor accumsan magna gravida pulvinar. Maecenas fringilla eleifend libero nec viverra. Etiam at libero sit amet metus consequat condimentum sit amet non tortor. Proin quis tortor eu risus ornare tristique et non nisi. In non nunc a erat vulputate aliquet eu ac est. Praesent sit amet ultricies eros, porttitor molestie justo.  Nulla a nunc libero. Nullam porttitor lacinia consequat. Quisque vitae porttitor est. Nulla facilisi. Quisque posuere justo nec est ultrices, facilisis vulputate turpis pulvinar. Curabitur sed congue tortor, sit amet bibendum lorem. Proin felis sapien, venenatis ultrices lorem sit amet, sollicitudin feugiat nisi. Nam porta malesuada aliquet. Curabitur laoreet arcu varius tellus pretium dignissim. In volutpat laoreet sem, sed sagittis velit. Donec non justo quam. Suspendisse nisl velit, rhoncus vitae fringilla sed, dignissim quis arcu. Aenean dignissim elit at sapien tincidunt laoreet.  Maecenas scelerisque, arcu sed posuere auctor, velit purus lobortis odio, quis eleifend dolor dolor eu dui. Morbi volutpat tristique velit, a tempor libero mollis ullamcorper. Cras vestibulum sollicitudin tempus. Donec pulvinar a nunc ut luctus. Morbi cursus metus erat, eu eleifend sem mattis sed. Pellentesque porttitor felis ut nunc pharetra, ut fermentum sapien pretium. Cras eu felis nulla. Cras quis elementum arcu. Proin lacinia velit sed scelerisque scelerisque. Vivamus vel mauris ut metus viverra tempor non ac risus. "	}] 	}, {"etat" : "ouvert","noTicket" : "15454","dateAppel" : 1383207200,"reference" : "15452","societe" : "societe 15454","refTicketClient" : "15455","dateCloture" : "","signalisation" : "signalisation 15454","categorie" : "categorie 15454","symptome" : "symptome long : Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis pretium ligula urna, sed tristique sapien adipiscing sed. Nunc laoreet, ipsum sit amet euismod accumsan, tellus.","site" : "site 15454","siteBarre" : "site barre 15454","priorite" : "priorite 15454","proactivite" : true,"dateModificationAT" : 1385207200,"actions" : [{		"date" : 1383207200,		"commentaire" : "com 15454.1"	}, {		"date" : 1583207200,		"commentaire" : "com 15454.2"	}, {		"date" : 1783207200,		"commentaire" : "com 15454.3"	}] 	}, {"etat" : "ouvert","noTicket" : "781","dateAppel" : 1283217200,"reference" : "782","societe" : "societe 781","refTicketClient" : "783","dateCloture" : "","signalisation" : "signalisation 781","categorie" : "categorie 781","symptome" : "symptome très long : Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vestibulum, ligula eget pretium pharetra, metus mauris varius nisl, in cursus tortor dui in felis. Integer eu ligula in tellus dapibus interdum. Nam non fermentum ipsum. Vestibulum ac nunc vel mauris blandit posuere in eget lectus. Nullam vestibulum tortor nec nibh consectetur lobortis. Fusce fringilla, odio in vulputate tempus, tortor tortor laoreet risus, ut posuere nisl nisi et ipsum. Nulla varius tempus tellus, sed tempor nibh. ","site" : "site 781","siteBarre" : "site barre 781","priorite" : "priorite 781","proactivite" : true,"dateModificationAT" : 1383217200,"actions" : [{		"date" : 1283217200,		"commentaire" : "com 781.1"	}, {		"date" : 1383217200,		"commentaire" : "com 781.2"	}, {		"date" : 1483217200,		"commentaire" : "com 781.3"	}] 	}, {"etat" : "clos","noTicket" : "43871","dateAppel" : 1384217200,"reference" : "43872","societe" : "societe 43871","refTicketClient" : "43873","dateCloture" : "","signalisation" : "signalisation 43871","categorie" : "categorie 43871","symptome" : "Autre symptome court","site" : "site 43871","siteBarre" : "site barre 43871","priorite" : "priorite 43871","proactivite" : true,"dateModificationAT" : 1383237200,"actions" : [{		"date" : 1283217200,		"commentaire" : "com 43871.1"	}, {		"date" : 1383217200,		"commentaire" : "com 43871.2"	}, {		"date" : 1483217200,		"commentaire" : "com 43871.3"	}, {		"date" : 1283217200,		"commentaire" : "com 43871.1"	}, {		"date" : 1383217200,		"commentaire" : "com 43871.2"	}, {		"date" : 1483217200,		"commentaire" : "com 43871.3"	}] 	}, {"etat" : "gele","noTicket" : "434871","dateAppel" : 1774217200,"reference" : "434871","societe" : "societe 434871","refTicketClient" : "434871","dateCloture" : "","signalisation" : "signalisation 434871","categorie" : "categorie 434871","symptome" : "Autre symptome court","site" : "site 434871","siteBarre" : "site barre 434871","priorite" : "priorite 434871","proactivite" : true,"dateModificationAT" : 1383237200,"actions" : [{		"date" : 1283217200,		"commentaire" : "com 434871.1"	}, {		"date" : 1383217200,		"commentaire" : "com 434871.2"	}, {		"date" : 1483217200,		"commentaire" : "com 434871.3"	}, {		"date" : 1283217200,		"commentaire" : "com 434871.1"	}, {		"date" : 1383217200,		"commentaire" : "com 434871.2"	}, {		"date" : 1483217200,		"commentaire" : "com 434871.3"	}] 	}, {"etat" : "gele","noTicket" : "4371","dateAppel" : 1774217200,"reference" : "4371","societe" : "societe 4371","refTicketClient" : "4371","dateCloture" : "","signalisation" : "signalisation 4371","categorie" : "categorie 4371","symptome" : "Autre symptome court","site" : "site 4371","siteBarre" : "site barre 4371","priorite" : "priorite 4371","proactivite" : true,"dateModificationAT" : 1383237200,"actions" : [{		"date" : 1283217200,		"commentaire" : "com 4371.1"	}, {		"date" : 1383217200,		"commentaire" : "com 4371.2"	}, {		"date" : 1483217200,		"commentaire" : "com 4371.3"	}, {		"date" : 1283217200,		"commentaire" : "com 4371.1"	}, {		"date" : 1383217200,		"commentaire" : "com 4371.2"	}, {		"date" : 1483217200,		"commentaire" : "com 4371.3"	}] 	}, {"etat" : "gele","noTicket" : "4371","dateAppel" : 1774217200,"reference" : "4371","societe" : "societe 4371","refTicketClient" : "4371","dateCloture" : "","signalisation" : "signalisation 4371","categorie" : "categorie 4371","symptome" : "Autre symptome court","site" : "site 4371","siteBarre" : "site barre 4371","priorite" : "priorite 4371","proactivite" : true,"dateModificationAT" : 1383237200,"actions" : [{		"date" : 1283217200,		"commentaire" : "com 4371.1"	}, {		"date" : 1383217200,		"commentaire" : "com 4371.2"	}, {		"date" : 1483217200,		"commentaire" : "com 4371.3"	}, {		"date" : 1283217200,		"commentaire" : "com 4371.1"	}, {		"date" : 1383217200,		"commentaire" : "com 4371.2"	}, {		"date" : 1483217200,		"commentaire" : "com 4371.3"	}] 	}, {"etat" : "gele","noTicket" : "4371","dateAppel" : 1774217200,"reference" : "4371","societe" : "societe 4371","refTicketClient" : "4371","dateCloture" : "","signalisation" : "signalisation 4371","categorie" : "categorie 4371","symptome" : "Autre symptome court","site" : "site 4371","siteBarre" : "site barre 4371","priorite" : "priorite 4371","proactivite" : true,"dateModificationAT" : 1383237200,"actions" : [{		"date" : 1283217200,		"commentaire" : "com 4371.1"	}, {		"date" : 1383217200,		"commentaire" : "com 4371.2"	}, {		"date" : 1483217200,		"commentaire" : "com 4371.3"	}, {		"date" : 1283217200,		"commentaire" : "com 4371.1"	}, {		"date" : 1383217200,		"commentaire" : "com 4371.2"	}, {		"date" : 1483217200,		"commentaire" : "com 4371.3"	}] 	}, {"etat" : "gele","noTicket" : "4371","dateAppel" : 1774217200,"reference" : "4371","societe" : "societe 4371","refTicketClient" : "4371","dateCloture" : "","signalisation" : "signalisation 4371","categorie" : "categorie 4371","symptome" : "Autre symptome court","site" : "site 4371","siteBarre" : "site barre 4371","priorite" : "priorite 4371","proactivite" : true,"dateModificationAT" : 1383237200,"actions" : [{		"date" : 1283217200,		"commentaire" : "com 4371.1"	}, {		"date" : 1383217200,		"commentaire" : "com 4371.2"	}, {		"date" : 1483217200,		"commentaire" : "com 4371.3"	}, {		"date" : 1283217200,		"commentaire" : "com 4371.1"	}, {		"date" : 1383217200,		"commentaire" : "com 4371.2"	}, {		"date" : 1483217200,		"commentaire" : "com 4371.3"	}] 	}, {"etat" : "gele","noTicket" : "4371","dateAppel" : 1774217200,"reference" : "4371","societe" : "societe 4371","refTicketClient" : "4371","dateCloture" : "","signalisation" : "signalisation 4371","categorie" : "categorie 4371","symptome" : "Autre symptome court","site" : "site 4371","siteBarre" : "site barre 4371","priorite" : "priorite 4371","proactivite" : true,"dateModificationAT" : 1383237200,"actions" : [{		"date" : 1283217200,		"commentaire" : "com 4371.1"	}, {		"date" : 1383217200,		"commentaire" : "com 4371.2"	}, {		"date" : 1483217200,		"commentaire" : "com 4371.3"	}, {		"date" : 1283217200,		"commentaire" : "com 4371.1"	}, {		"date" : 1383217200,		"commentaire" : "com 4371.2"	}, {		"date" : 1483217200,		"commentaire" : "com 4371.3"	}] 	}, {"etat" : "gele","noTicket" : "4371","dateAppel" : 1774217200,"reference" : "4371","societe" : "societe 4371","refTicketClient" : "4371","dateCloture" : "","signalisation" : "signalisation 4371","categorie" : "categorie 4371","symptome" : "Autre symptome court","site" : "site 4371","siteBarre" : "site barre 4371","priorite" : "priorite 4371","proactivite" : true,"dateModificationAT" : 1383237200,"actions" : [{		"date" : 1283217200,		"commentaire" : "com 4371.1"	}, {		"date" : 1383217200,		"commentaire" : "com 4371.2"	}, {		"date" : 1483217200,		"commentaire" : "com 4371.3"	}, {		"date" : 1283217200,		"commentaire" : "com 4371.1"	}, {		"date" : 1383217200,		"commentaire" : "com 4371.2"	}, {		"date" : 1483217200,		"commentaire" : "com 4371.3"	}] 	}, {"etat" : "gele","noTicket" : "4371","dateAppel" : 1774217200,"reference" : "4371","societe" : "societe 4371","refTicketClient" : "4371","dateCloture" : "","signalisation" : "signalisation 4371","categorie" : "categorie 4371","symptome" : "Autre symptome court","site" : "site 4371","siteBarre" : "site barre 4371","priorite" : "priorite 4371","proactivite" : true,"dateModificationAT" : 1383237200,"actions" : [{		"date" : 1283217200,		"commentaire" : "com 4371.1"	}, {		"date" : 1383217200,		"commentaire" : "com 4371.2"	}, {		"date" : 1483217200,		"commentaire" : "com 4371.3"	}, {		"date" : 1283217200,		"commentaire" : "com 4371.1"	}, {		"date" : 1383217200,		"commentaire" : "com 4371.2"	}, {		"date" : 1483217200,		"commentaire" : "com 4371.3"	}] 	}, {"etat" : "gele","noTicket" : "4371","dateAppel" : 1774217200,"reference" : "4371","societe" : "societe 4371","refTicketClient" : "4371","dateCloture" : "","signalisation" : "signalisation 4371","categorie" : "categorie 4371","symptome" : "Autre symptome court","site" : "site 4371","siteBarre" : "site barre 4371","priorite" : "priorite 4371","proactivite" : true,"dateModificationAT" : 1383237200,"actions" : [{		"date" : 1283217200,		"commentaire" : "com 4371.1"	}, {		"date" : 1383217200,		"commentaire" : "com 4371.2"	}, {		"date" : 1483217200,		"commentaire" : "com 4371.3"	}, {		"date" : 1283217200,		"commentaire" : "com 4371.1"	}, {		"date" : 1383217200,		"commentaire" : "com 4371.2"	}, {		"date" : 1483217200,		"commentaire" : "com 4371.3"	}] 	}, {"etat" : "gele","noTicket" : "4371","dateAppel" : 1774217200,"reference" : "4371","societe" : "societe 4371","refTicketClient" : "4371","dateCloture" : "","signalisation" : "signalisation 4371","categorie" : "categorie 4371","symptome" : "Autre symptome court","site" : "site 4371","siteBarre" : "site barre 4371","priorite" : "priorite 4371","proactivite" : true,"dateModificationAT" : 1383237200,"actions" : [{		"date" : 1283217200,		"commentaire" : "com 4371.1"	}, {		"date" : 1383217200,		"commentaire" : "com 4371.2"	}, {		"date" : 1483217200,		"commentaire" : "com 4371.3"	}, {		"date" : 1283217200,		"commentaire" : "com 4371.1"	}, {		"date" : 1383217200,		"commentaire" : "com 4371.2"	}, {		"date" : 1483217200,		"commentaire" : "com 4371.3"	}] 	}, {"etat" : "gele","noTicket" : "4371","dateAppel" : 1774217200,"reference" : "4371","societe" : "societe 4371","refTicketClient" : "4371","dateCloture" : "","signalisation" : "signalisation 4371","categorie" : "categorie 4371","symptome" : "Autre symptome court","site" : "site 4371","siteBarre" : "site barre 4371","priorite" : "priorite 4371","proactivite" : true,"dateModificationAT" : 1383237200,"actions" : [{		"date" : 1283217200,		"commentaire" : "com 4371.1"	}, {		"date" : 1383217200,		"commentaire" : "com 4371.2"	}, {		"date" : 1483217200,		"commentaire" : "com 4371.3"	}, {		"date" : 1283217200,		"commentaire" : "com 4371.1"	}, {		"date" : 1383217200,		"commentaire" : "com 4371.2"	}, {		"date" : 1483217200,		"commentaire" : "com 4371.3"	}] 	} ] ');
			addTicketsToStoreAndFillTicketLists();
			$scope.loader = false;
		} else {
			var base64Encoded = $rootScope.loginHeader;

			var ouvertUrl = $rootScope.rootUrl + "ticket/recherche?ouvert=true";
			$http.get(ouvertUrl,{headers: {'Authorization': 'Basic ' + base64Encoded}, timeout : $scope.globalTimeout}).success(loadTicketsOuvertsSuccess).error(httpError);

			var geleUrl = $rootScope.rootUrl + "ticket/recherche?gele=true";
			$http.get(geleUrl,{headers: {'Authorization': 'Basic ' + base64Encoded}, timeout : $scope.globalTimeout}).success(loadTicketsGelesSuccess).error(httpError);

			var resoluUrl = $rootScope.rootUrl + "ticket/recherche?resolu=true";
			$http.get(resoluUrl,{headers: {'Authorization': 'Basic ' + base64Encoded}, timeout : $scope.globalTimeout}).success(loadTicketsResolusSuccess).error(httpError);

			var closUrl = $rootScope.rootUrl + "ticket/recherche?clos=true";
			$http.get(closUrl,{headers: {'Authorization': 'Basic ' + base64Encoded}, timeout : $scope.globalTimeout}).success(loadTicketsClosSuccess).error(httpError);
		}
	}

	loadTicketsOuvertsSuccess = function(data, status, headers, config) {
		$scope.loader = true;
		$scope.ticketsListOuverts = data;
		addTicketsToStore(data);
	} 

	loadTicketsGelesSuccess = function(data, status, headers, config) {
		$scope.loader = true;
		$scope.ticketsListGeles = data;
		addTicketsToStore(data);
	} 

	loadTicketsResolusSuccess = function(data, status, headers, config) {
		$scope.loader = true;
		$scope.ticketsListResolus = data;
		addTicketsToStore(data);
	} 

	loadTicketsClosSuccess = function(data, status, headers, config) {
		$scope.loader = true;
		$scope.ticketsListClos = data;
		addTicketsToStore(data);
	} 

	function addTicketsToStore(ticketArray) {
		for (var i = 0; i < ticketArray.length; i++) {
			$currentTicket = ticketArray[i];
			$store.set($currentTicket.noTicket, $currentTicket);
		}
		$scope.loader = false;
	}


}