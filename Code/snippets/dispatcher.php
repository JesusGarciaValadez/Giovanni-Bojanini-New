<?php

header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
header("Expires: Mon, 26 Jul 1997 05:00:00 GMT"); // Date in the past

if ( file_exists( 'config/config.php' ) ) {

    define( 'CURRENT_PATH',dirname(__FILE__) );
    require_once 'config/config.php';
} else {

    exit('no fue posible localizar el archivo de configuración.');
}

function __autoload( $className ) {

    require_once LIBS_PATH . "{$className}.php";
}

require_once SNIPPETS_PATH . 'db/connection.php';

error_reporting(E_ALL | E_STRICT);
ini_set('display_errors', 1);

if ( ! empty( $_GET['action'] ) ) {

    $action = strip_tags( trim( $_GET[ 'action' ] ) );

    $data = array();

    try {

        switch ( $action ) {
            case 'sendBudget':

                $cc = array(
                        /*array(
                            'mail'  => 'jgarcia@cmvasfalto.com.mx',
                            'name'  => 'Jesús'),
                        array(
                            'mail'  => 'vdavila@cmvasfalto.com.mx',
                            'name'  => 'Vico'),
                        array(
                            'mail'  => 'dharjani@cmv.com.mx',
                            'name'  => 'Devki Harjani'), */
                        array(
                            'mail'  => 'dbermudez@cdgb.com.mx',
                            'name'  => 'DBermudez')
                    );

                $doInsert   = new Review( $dbh, 'budget_request' );
                $doInsert   = $doInsert->insertInit(
                    $_POST,
                    "template_mailing_diagnostic.html",
                    $_POST[ 'budget_name' ] . " está interesado en pedir información",
                    "injerto@cdgb.com.mx",
                    $cc );
                $data       = json_encode ( $doInsert );
            break;
            case 'sendBudgetAppointent':

                $cc = array(
                        array(
                            'mail'  => 'jgarcia@cmvasfalto.com.mx',
                            'name'  => 'Jesús'),
                        /*array(
                            'mail'  => 'vdavila@cmvasfalto.com.mx',
                            'name'  => 'Vico'),
                        array(
                            'mail'  => 'dharjani@cmv.com.mx',
                            'name'  => 'Devki Harjani'), */
                        array(
                            'mail'  => 'dbermudez@cdgb.com.mx',
                            'name'  => 'DBermudez')
                    );

                $doInsert   = new Review( $dbh, 'budget_request_appointment' );
                $doInsert   = $doInsert->insertBudgetAppointment(
                    $_POST,
                    "template_mailing_diagnostic_appointment.html",
                    $_POST[ 'budget_name' ] . " está interesado en pedir información",
                    "injerto@cdgb.com.mx",
                    $cc );
                $data       = json_encode ( $doInsert );
            break;
            case 'sendContact':

                $cc = array(
                        /*array(
                            'mail'  => 'jgarcia@cmvasfalto.com.mx',
                            'name'  => 'Jesús'),
                        array(
                            'mail'  => 'vdavila@cmvasfalto.com.mx',
                            'name'  => 'Vico'),
                        array(
                            'mail'  => 'dharjani@cmv.com.mx',
                            'name'  => 'Devki Harjani'), */
                    );

                $doInsert   = new Review( $dbh, 'citas' );
                $doInsert   = $doInsert->insertContact(
                    $_POST,
                    "template_mailing_contact.html",
                    "Giovanni Bojanini - Información de Contacto",
                    "info@cdgb.com.mx",
                    $cc );
                $data       = json_encode ( $doInsert );
            break;
            case 'sendAppointment':

                $cc = array(
                        /*array(
                            'mail'  => 'jgarcia@cmvasfalto.com.mx',
                            'name'  => 'Jesús'),
                        array(
                            'mail'  => 'vdavila@cmvasfalto.com.mx',
                            'name'  => 'Vico'),
                        array(
                            'mail'  => 'dharjani@cmv.com.mx',
                            'name'  => 'Devki Harjani'), */
                    );

                $doInsert   = new Review( $dbh, 'citas' );
                $doInsert   = $doInsert->insertAppointment(
                    $_POST,
                    "template_mailing_appointment.html",
                    "Giovanni Bojanini - Control de Citas",
                    "info@cdgb.com.mx",
                    $cc );
                $data       = json_encode ( $doInsert );
            break;
        }
        echo $data;

    } catch ( Exception $e ) {

        switch ( $e->getCode() ) {

            case 5910 :
                echo 'DATA BASE ERROR: '.$e->getMessage();
                $message = 'Lo sentimos, ocurrió un error inesperado al tratar de guardar los datos.';
                break;

            case 5810 :
                echo 'MAILER ERROR: '. $e->getMessage();
                $message = 'Lo sentimos, ocurrió un error inesperado al tratar de enviar el correo.';
                break;
            default : $message = $e->getMessage();
        }

        $data = array ('success' => false , 'message' => $message ) ;
        echo json_encode( $data );
    }
}