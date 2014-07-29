<?php

include("./class.phpmailer.php");

$database_user      = 'asfalto';
$database_password  = '_CMV4sf4l7001_';
$dbase              = 'gB0j4n1n1N3w';

$nombre             = $_POST[ "nombre" ];
$apellido           = $_POST[ "apellido" ];
$Correo             = $_POST[ "correo" ];
$telefono           = $_POST[ "telefono" ];
$fecha              = $_POST[ "fecha" ];
$horario            = $_POST[ "horario" ];
$medio              = $_POST[ "medio" ];
$mensaje            = $_POST[ "mensaje" ];
try {
    
    $gbd    = new PDO( 'mysql:host=localhost;dbname=gB0j4n1n1N3w', $database_user, $database_password );
    $sql    = "INSERT INTO citas (nombreC, apellidosC, emailC, telefonoC, diaC, horario, medio, mensaje) VALUES ('$nombre', '$apellido', '$Correo', $telefono, '$fecha', '$horario', '$medio', '$mensaje')";
    
    $query  = $gbd->prepare( $sql );
    
    if ( $query->execute() ) {
?>
        <div>
            <p>Muchas gracias por tu interés,</p>
            <p>en breve un representante se pondrá en contacto contigo para confirmar.</p>
        </div>
<?php
////////////////////  ENVIAR CORREO  //////////////////////////////////////////
        $mail           = new PHPMailer();
        $mail->CharSet  = 'utf-8';
        $mail->IsSMTP();
        $mail->AddAddress( "info@cdgb.com.mx", 'info@cdgb.com.mx' );
        $mail->AddBCC( "pgomez@cmv.com.mx", "Pola" );
        /*$mail->AddBCC( "miguel@ideadiseno.com", 'info@cdgb.com.mx' );
        $mail->AddBCC( "vdavila@cmv.com.mx", 'info@cdgb.com.mx' );
        $mail->AddBCC( "jgarcia@cmvasfalto.com.mx", 'info@cdgb.com.mx' );*/
        
        $mail->Subject  = "Hola. Quisiera una cita.";
        $mail->From     = 'info@cdgb.com.mx';
        $mail->FromName = 'Giovanni Bojanini - Control de Citas';
        
        $mail->Body     = "Hola, me gustaría una cita\r\n\r\n".
        "Nombre: ".$nombre." ".$apellido."\r\n".
        "Correo: ".$Correo."\r\n".
        "Telefono: ".$telefono."\r\n".
        "Fecha: ".$fecha."\r\n".
        "Horario: ".$horario."\r\n".
        "Medio de Comunicación: ".$medio."\r\n".
        "Comentario. ".$mensaje."\r\n";
        
        if( !$mail->Send() ) {
            echo "Error: " . $mail->ErrorInfo;
        } else {
            echo "Mensaje enviado.";
            //header('Location: ../../index.php');
        }
////////////////////  FIN ENVIAR CORREO  //////////////////////////////////////////
    }
    
    $gbd = null;
    
    //header('Location: ../../index.php');
} catch ( PDOException $e ) {
    
    print "¡Error!: " . $e->getMessage() . "<br/>";
    die();
}
?>

