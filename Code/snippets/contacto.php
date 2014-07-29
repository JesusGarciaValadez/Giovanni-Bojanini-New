<?php 
    
    include( "class.phpmailer.php" );
    
    $nombre     = $_POST["nombre"];
    $apellido   = $_POST["apellido"];
    $correo     = $_POST["correo"];
    $telefono   = $_POST["telefono"];
    $paciente   = $_POST["paciente"];
    if ( isset( $_POST["sucursal"] ) && !empty( $_POST["sucursal"] ) ) {
        $sucursal   = $_POST["sucursal"];
    }
    $ayuda      = $_POST["ayuda"];
    $medio      = $_POST["medio"];
    $mensaje    = $_POST["mensaje"];
    
////////////////////  ENVIAR CORREO  //////////////////////////////////////////
    
    $mail       = new PHPMailer();
    
    $mail->CharSet  = 'utf-8';
    
    $mail->IsSMTP();
    
    $mail->AddAddress( "info@cdgb.com.mx", 'info@cdgb.com.mx' );
    /*$mail->AddBCC( "vdavila@cmv.com.mx", 'Vico' );
    $mail->AddBCC( "jgarcia@cmvasfalto.com.mx", 'Mighty Yisus' );*/
    $mail->AddBCC( "pgomez@cmv.com.mx", "Pola" );
    
    $mail->Subject  = "Información de Contacto.";
    $mail->From     = 'info@cdgb.com.mx';
    $mail->FromName = 'Giovanni Bojanini - Información de Contacto';
    
    $body           = "Hola tengo un comentario\r\n\r\n".
    "Nombre: ".$nombre." ".$apellido."\r\n".
    "Correo: ".$correo."\r\n".
    "Telefono: ".$telefono."\r\n".
    "Es paciente: ".$paciente."\r\n";
    
    if ( isset( $sucursal ) && !empty( $sucursal ) ) {
        
        "Sucursal: ".$sucursal."\r\n".;
    }
    $body          .= "Motivo: ".$ayuda."\r\n".
    "Medio de Comunicación: ".$medio."\r\n".
    "Comentario. ".$mensaje."\r\n";
    
    $mail->Body = $body;
    
    if( !$mail->Send() ) {
        echo "Error: " . $mail->ErrorInfo;
    } else {
        
        echo "Mensaje enviado.";
        //header('Location: ../../index.php');
    }

////////////////////  FIN ENVIAR CORREO  //////////////////////////////////////////

?>
