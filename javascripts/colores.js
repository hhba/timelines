function name_to_col(texto) {
	var valor = 0;
	var colores = Array(3);
	for(x=0;x<texto.length;x++){
		var chr = texto.charAt(x);
		var sumar = chr.charCodeAt(chr);
        	sumar = (sumar/255);
		valor = valor + sumar;
		colores[x] = ((valor/texto.length)*255);
	}
//	valor = (valor/texto.length);
	return(colores)
}

var lala = name_to_col("Mordor");
//var col = rgb(lala[0],lala[1],int(lala[2]);
