function ConnexionCtrl($rootScope, $scope, $store, $http, $location) {
	$scope.login = "";
	$scope.password = "";
	$scope.rememberme = false;
	$scope.loader = false;

	$scope.dev = false;



	// $rootScope.rootUrl = "http://m.completel.com/apiticketrest/";
	$rootScope.rootUrl = "http://www.proxiad-axe-seine.com/apiticketrest/";
	// $rootScope.rootUrl = "http://192.168.1.166:8080/apiticketrest/";


	$scope.checkRememberMe = function() {
		var rememberMe = $store.get("rememberme");
		if (rememberMe) {
			$scope.rememberme = true;
			$scope.login = $store.get("remembermeLogin");
		} else {
			$scope.rememberme = false;
			$scope.login = "";			
		}
	}

	$scope.connect = function() {
		$scope.loader = true;
		var login =  $scope.login;
		var password =  $scope.password;

		if ($scope.rememberme) {
			$store.set("remembermeLogin", login);
			$store.set("rememberme", true);
		} else {
			$store.set("remembermeLogin", "");
			$store.set("rememberme", false);
		}

		if (!login || !password) {
			createAlertMessage('Veuillez renseigner votre login et votre mot de passe.');
			$scope.loader = false;
			return;
		}

		if ($scope.dev) {
			$store.set("typeUtilisateur", "devType");
			$store.set("userId", -1)
			$store.set("login", "devLogin");

			redirectionToHome();
		} else {
			var url = $rootScope.rootUrl + "identification";

			var base64Encoded = toBase64(login + ":" + password);

			$rootScope.loginHeader = base64Encoded;
			$http.get(url, {headers: {'Authorization': 'Basic ' + base64Encoded}, timeout : 30000}).success(httpLoginSuccess).error(httpLoginError);

		}
	}

	httpLoginSuccess = function(data, status, headers, config) {
		var rubs = data.rubriques;

		var hasRub3 = ($.inArray("rub3", rubs) != -1);
		var hasRub15 = ($.inArray("rub15", rubs) != -1);
		var hasRub16 = ($.inArray("rub16", rubs) != -1);
		var hasRub17 = ($.inArray("rub17", rubs) != -1);

		var typeUtilisateur = data.type_utilisateur;

		if (!hasRub3 && !hasRub15 && !hasRub16 && !hasRub17) {
			if ( !(type_utilisateur == "accestotal") && !(type_utilisateur == "adminnet") ) {
				alert("Vous n’avez pas accès à cette application.");
				$scope.loader = false;
			}
		} 

		$store.set("typeUtilisateur", typeUtilisateur);
		// $store.set("typeUtilisateur", "");
		$store.set("userId", data.id)
		$store.set("login", $scope.login);

		redirectionToHome();
	}

	httpLoginError = function(data, status, headers, config) {

		switch(status) {
			case 401:
			createAlertMessage("Identifiants incorrects. L'extranet web vous permettra de les retrouver.");
			break;
			case 500:
			createAlertMessage("Erreur interne de serveur.");
			break;
			default :
			createAlertMessage("Une erreur est survenue.");
		}

		$scope.loader = false;
	}

	function redirectionToHome() {
		$location.path('/home');
		// $scope.$apply();
	}

}

