var tmplPoc = "<h3>Teplota: {{main.temp}} °C Tlak: {{main.pressure}}  Oblačnosť: {{clouds.all}} ";

$.getJSON("http://api.openweathermap.org/data/2.5/weather", {
	id : "724443",
	units : 'metric',
	APPID : "8641355d0bdfa52a49f4e9a42560adf0"
}, spracuj);

function spracuj(udaje) {
	$("#pocasie").html(Mustache.render(tmplPoc, udaje));
}

var tmplPoc1 = "{{#list}}<h3>Dátum: {{dt_txt}} Teplota: {{main.temp}} °C Tlak:{{main.pressure}} hPa Oblačnosť:{{clouds.all}} %</h3>{{/list}}"

$.getJSON("http://api.openweathermap.org/data/2.5/forecast", {
	id : "724443",
	units : 'metric',
	APPID : "8641355d0bdfa52a49f4e9a42560adf0",
	cnt : "5"
}, spracuj1);

function spracuj1(udajee) {
	$("#pocasieLong").html(Mustache.render(tmplPoc1, udajee));
}

var $frm = $("#frmArt");

// Pridanie funkcionality pre kliknutie na tlacidlo "UloĹľ ÄŤlĂˇnok"
$frm.submit(function(event) { // tu potrebujem aj objekt s udalosĹĄou, aby som
	event.preventDefault(); // zruĹˇiĹĄ pĂ´vodnĂ© spracovanie udalosti
	skontrolujAOdosli();
});

function skontrolujAOdosli() {
	// 1. UloĹľĂ­ Ăşdaje z formulĂˇra do objektu
	var data = {};
	$frm.serializeArray().map(function(item) {
		var itemValueTrimmed = item.value.trim();
		if (itemValueTrimmed) {// ak je hodnota neprĂˇzdny reĹĄazec
			data[item.name] = itemValueTrimmed;
		}
	});

	console.log(data);
	
	console.log("skontrolujAOdosli> Ăšdaje po uloĹľenĂ­ z formulĂˇra do objektu:");
	console.log(JSON.stringify(data));

	// 3.Kontrola, ÄŤi boli zadanĂ© povinnĂ© polia
	if (!data.title) { // toto len pre istotu
		alert("NĂˇzov ÄŤlĂˇnku musĂ­ byĹĄ zadanĂ˝ a musĂ­ obsahovaĹĄ ÄŤitateÄľnĂ© znaky");
		return;
	}
	if (!data.content) { // toto je dĂ´leĹľitĂ©, keÄŹĹľe na textarea sa nedĂˇ
							// pouĹľiĹĄ pattern. OdchytĂ­, keÄŹ pouĹľĂ­vateÄľ do
							// prvku content
		// zadal iba biele znaky
		alert("Obsah ÄŤlĂˇnku musĂ­ byĹĄ zadanĂ˝ a musĂ­ obsahovaĹĄ ÄŤitateÄľnĂ© znaky.");
		return;
	}

	data.content = "<div>" + data.content + "</div>";
	switch (data.status) {
	case "0":
		data.content += "<p> Nechystam sa </p>";
		break;
	case "1":
		data.content += "<p> Chystam sa </p>";
		break;
	case "2":
		data.content += "<p> Nie </p>";
		break;
	case "3":
		data.content += "<p> Ano </p>";
		break;
	}
	delete data.status;
	
	data.content = "<div>" + data.content + "</div>";
	if (data.inovaciaR) {
		data.content += "<p>Reštauráciu</p>";
	}
	if (data.inovaciaK) {
		data.content += "<p>Kúpalisko</p>";
	}
	if (data.inovaciaP) {
		data.content += "<p>Pumpu</p>";
	}
	if (data.inovaciaL) {
		data.content += "<p>Lepšie cesty.</p>";
	}
	delete data.status;
	
	data.content = "<div>" + data.content + "</div>";
	switch (data.oblubene) {
	case "drahy":
		data.content += "<p> Drahy opal </p>";
		break;
	case "mliecny":
		data.content += "<p> Mliecny opal </p>";
		break;
	case "sklenny":
		data.content += "<p> Sklenny opal </p>";
		break;
	case "ziadny":
		data.content += "<p> Ziadny opal </p>";
		break;
	}
	delete data.oblubene;
	
	data.content = "<div>" + data.content + "</div>";
	switch (data.pohlavie) {
	case "m":
		data.content += "<p> muz </p>";
		break;
	case "f":
		data.content += "<p> zena </p>";
		break;
	case "x":
		data.content += "<p> neviem </p>";
		break;
	case "o":
		data.content += "<p> nepoviem </p>";
		break;
	}
	delete data.pohlavie;
	
	console.log("prepareAndSendArticle> PovinnĂ© Ăşdaje ĂşspeĹˇne skontrolovanĂ©:");

	// 4. odoslanie Ăşdajov
	if (window.confirm("SkutoÄŤne si ĹľelĂˇte ÄŤlĂˇnok odoslaĹĄ?")) {
		$
				.ajax({
					type : "POST",
					url : "http://wt.kpi.fei.tuke.sk/api/article",
					contentType : "application/json;charset=UTF-8",
					dataType : "json",
					data : JSON.stringify(data),
					success : function(response) {
						if (response.id) {
							console.log(response.id);
							window.alert("ÄŚlĂˇnok ĂşspeĹˇne uloĹľenĂ˝ s id="
									+ response.id + ".");
							window
									.open(
											'http://hron.fei.tuke.sk/~korecko/WebTechAkademia/wtKpiBlogBrowser/article.html?id='
													+ response.id, '_blank');
							$frm.trigger('reset');
						}
					},
					error : function(jxhr) {
						window
								.alert("Spracovanie neĂşspeĹˇnĂ©. Ăšdaje neboli zapĂ­sanĂ©. KĂłd chyby:"
										+ status
										+ "\n"
										+ jxhr.statusText
										+ "\n" + jxhr.responseText);
					}
				});

	}
}