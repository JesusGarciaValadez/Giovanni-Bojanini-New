<?php
//require_once LIBS_PATH.'filter.input.php';
//require_once LIBS_PATH.'mailer.php';
//require_once LIBS_PATH.'ParserTemplate.php';

class Review extends Model {

    private $_PDOConn = null;

    public function __construct( $conn, $db_table )  {
        $this->_tableName = $db_table;
        $this->_primaryKey = '';
        $this->setMysqlConn( $conn );
        $this->_PDOConn = $conn;
    }
    public function insertInit ( $info, $template, $subject, $correo, $cc = array() ) {

        //  Validación de los datos
        $parameters = array(
            'budget_name' => array(
                'requerido' => 1, 'validador' => 'esAlfaNumerico', 'mensaje' => utf8_encode( 'El nombre es obligatorio.' ) ),
            'budget_phone' => array(
                'requerido' => 1, 'validador' => 'esAlfaNumerico', 'mensaje' => utf8_encode( 'El teléfono es obligatoria.' ) ),
            'budget_mail' => array(
                'requerido' => 1, 'validador' => 'esEmail', 'mensaje' => utf8_encode( 'El mail es obligatoria.' ) ),
            'type' => array(
                'requerido' => 1, 'validador' => 'esAlfaNumerico', 'mensaje' => utf8_encode( 'El tipo es obligatorio.' ) ),
        );

        $form = new Validator( $info, $parameters );

        // Si el formulario no es válido
        if ( !$form->validate() ) {

            $response = array(
                'success' => 'false',
                'message'=> $form->getMessage()
            );
        } else {

            try {

                $this->_PDOConn->beginTransaction();

                $info[ 'date_request' ] = date( "Y-m-d H:i:s" );

                $success    = $this->insert( $info );

                if ( $success ) {

                    $emails = explode( ',' , $correo );
                    $to     = array();

                    foreach ($emails as $email) {

                        $params = array(
                            'mail' => array(
                                'requerido' => 1 ,'validador' => 'esEmail', 'mensaje' => utf8_encode( 'El correo no es v&aacute;lido.' ) )
                        );

                        $destinatario = array(
                            'name' => $email,
                            'mail' => $email
                        );

                        $form   = new Validator( $destinatario, $params );
                        if ( ( $form->validate() ) === false ) {

                            throw new Exception('El correo ' . $email . ' no es v&aacute;lido.');
                        }
                        $to[] = $destinatario;
                    }

                    $vars = array(
                            'budget_name'       => $info[ 'budget_name' ],
                            'budget_phone'      => $info[ 'budget_phone' ],
                            'budget_mail'       => $info[ 'budget_mail' ],
                            'type'              => $info[ 'type' ]
                        );
                    $tpl = ParserTemplate::parseTemplate( $template, $vars );

                    $_cc    = $cc;

                    if ( Mailer::sendMail( $subject, $tpl, $to , '' , $_cc ) ) {

                        $response       = array (
                            'success' => 'true',
                            'message' => utf8_encode( 'Muchas gracias por ponerse en contacto con nosotros.' )
                        );
                    } else {

                        $response = array (
                            'success'=>'false',
                            'message'=>utf8_encode( 'El servicio de correo no esta disponible' )
                        );
                    }
                } else {

                    $response = array(
                        'success' => 'false',
                        'message' => utf8_encode('No fue posible guardar la información.')
                    );
                }

                $this->_PDOConn->commit();

            } catch ( PDOException $e ) {

                $this->_PDOConn->rollBack();
                $response   = array ( 'success'=>'false', 'msg'=>'el servicio de DB no esta disponible' );
            } catch ( phpmailerException $e ) {

                $this->_PDOConn->rollBack();
                $response   = array ( 'success'=>'false', 'msg'=>'el servicio de correo no esta disponible' );
            }
        }
        return $response;
    }
    public function insertBudgetAppointment ( $info, $template, $subject, $correo, $cc = array() ) {

        //  Validación de los datos
        $parameters = array(
            'budget_name' => array(
                'requerido' => 1, 'validador' => 'esAlfaNumerico', 'mensaje' => utf8_encode( 'El nombre es obligatorio.' ) ),
            'budget_phone' => array(
                'requerido' => 1, 'validador' => 'esAlfaNumerico', 'mensaje' => utf8_encode( 'El teléfono es obligatoria.' ) ),
            'budget_mail' => array(
                'requerido' => 1, 'validador' => 'esEmail', 'mensaje' => utf8_encode( 'El mail es obligatoria.' ) )
        );

        $form = new Validator( $info, $parameters );

        // Si el formulario no es válido
        if ( !$form->validate() ) {

            $response = array(
                'success' => 'false',
                'message'=> $form->getMessage()
            );
        } else {

            try {

                $this->_PDOConn->beginTransaction();

                $info[ 'date_request' ] = date( "Y-m-d H:i:s" );

                $success    = $this->insert( $info );

                if ( $success ) {

                    $emails = explode( ',' , $correo );
                    $to     = array();

                    foreach ($emails as $email) {

                        $params = array(
                            'mail' => array(
                                'requerido' => 1 ,'validador' => 'esEmail', 'mensaje' => utf8_encode( 'El correo no es v&aacute;lido.' ) )
                        );

                        $destinatario = array(
                            'name' => $email,
                            'mail' => $email
                        );

                        $form   = new Validator( $destinatario, $params );
                        if ( ( $form->validate() ) === false ) {

                            throw new Exception('El correo ' . $email . ' no es v&aacute;lido.');
                        }
                        $to[] = $destinatario;
                    }

                    $vars = array(
                            'budget_name'       => $info[ 'budget_name' ],
                            'budget_phone'      => $info[ 'budget_phone' ],
                            'budget_mail'       => $info[ 'budget_mail' ]
                        );
                    $tpl = ParserTemplate::parseTemplate( $template, $vars );

                    $_cc    = $cc;

                    if ( Mailer::sendMail( $subject, $tpl, $to , '' , $_cc ) ) {

                        $response       = array (
                            'success' => 'true',
                            'message' => utf8_encode( 'Muchas gracias por ponerse en contacto con nosotros.' )
                        );
                    } else {

                        $response = array (
                            'success'=>'false',
                            'message'=>utf8_encode( 'El servicio de correo no esta disponible' )
                        );
                    }
                } else {

                    $response = array(
                        'success' => 'false',
                        'message' => utf8_encode('No fue posible guardar la información.')
                    );
                }

                $this->_PDOConn->commit();

            } catch ( PDOException $e ) {

                $this->_PDOConn->rollBack();
                $response   = array ( 'success'=>'false', 'msg'=>'el servicio de DB no esta disponible' );
            } catch ( phpmailerException $e ) {

                $this->_PDOConn->rollBack();
                $response   = array ( 'success'=>'false', 'msg'=>'el servicio de correo no esta disponible' );
            }
        }
        return $response;
    }
    public function insertContact ( $info, $template, $subject, $correo, $cc = array() ) {

        //  Validación de los datos
        $parameters = array(
            'nombre' => array(
                'requerido' => 1, 'validador' => 'esAlfaNumerico', 'mensaje' => utf8_encode( 'El nombre es obligatorio.' ) ),
            'apellido' => array(
                'requerido' => 1, 'validador' => 'esAlfaNumerico', 'mensaje' => utf8_encode( 'El apellido es obligatoria.' ) ),
            'correo' => array(
                'requerido' => 1, 'validador' => 'esEmail', 'mensaje' => utf8_encode( 'El mail es obligatoria.' ) ),
            'telefono' => array(
                'requerido' => 1, 'validador' => 'esAlfaNumerico', 'mensaje' => utf8_encode( 'El telefono es obligatorio.' ) ),
            'paciente' => array(
                'requerido' => 1, 'validador' => 'esAlfaNumerico', 'mensaje' => utf8_encode( 'Si es paciente es obligatorio.' ) ),
            'sucursal' => array(
                'requerido' => 0, 'validador' => 'esAlfaNumerico', 'mensaje' => utf8_encode( 'La sucursal es obligatorio.' ) ),
            'ayuda' => array(
                'requerido' => 1, 'validador' => 'esAlfaNumerico', 'mensaje' => utf8_encode( 'La ayuda es obligatoria.' ) ),
            'medio' => array(
                'requerido' => 1, 'validador' => 'esAlfaNumerico', 'mensaje' => utf8_encode( 'El medio de contacto es obligatorio.' ) ),
            'mensaje' => array(
                'requerido' => 1, 'validador' => 'esAlfaNumerico', 'mensaje' => utf8_encode( 'El mensaje es obligatorio.' ) ),
        );

        $form = new Validator( $info, $parameters );

        // Si el formulario no es válido
        if ( !$form->validate() ) {

            $response = array(
                'success' => 'false',
                'message'=> $form->getMessage()
            );
        } else {

            try {

                $emails = explode( ',' , $correo );
                $to     = array();

                foreach ($emails as $email) {

                        $params = array(
                            'mail' => array(
                                'requerido' => 1 ,'validador' => 'esEmail', 'mensaje' => utf8_encode( 'El correo no es v&aacute;lido.' ) )
                        );

                        $destinatario = array(
                            'name' => $email,
                            'mail' => $email
                        );

                        $form   = new Validator( $destinatario, $params );
                        if ( ( $form->validate() ) === false ) {

                            throw new Exception('El correo ' . $email . ' no es v&aacute;lido.');
                        }
                        $to[] = $destinatario;
                    }

                $vars = array(
                        'nombre'    => $info[ 'nombre' ],
                        'apellido'  => $info[ 'apellido' ],
                        'correo'    => $info[ 'correo' ],
                        'telefono'  => $info[ 'telefono' ],
                        'paciente'  => $info[ 'paciente' ],
                        'sucursal'  => $info[ 'sucursal' ],
                        'ayuda'     => $info[ 'ayuda' ],
                        'medio'     => $info[ 'medio' ],
                        'mensaje'   => $info[ 'mensaje' ]
                    );
                $tpl = ParserTemplate::parseTemplate( $template, $vars );

                $_cc    = $cc;

                if ( Mailer::sendMail( $subject, $tpl, $to , '' , $_cc ) ) {

                    $response       = array (
                        'success' => 'true',
                        'message' => utf8_encode( 'Muchas gracias por ponerse en contacto con nosotros.' )
                    );
                } else {

                    $response = array (
                        'success'=>'false',
                        'message'=>utf8_encode( 'El servicio de correo no esta disponible' )
                    );
                }
            } catch ( phpmailerException $e ) {

                $this->_PDOConn->rollBack();
                $response   = array ( 'success'=>'false', 'msg'=>'el servicio de correo no esta disponible' );
            }
        }
        return $response;
    }
    public function insertAppointment ( $info, $template, $subject, $correo, $cc = array() ) {

        //  Validación de los datos
        $parameters = array(
            'nombre' => array(
                'requerido' => 1, 'validador' => 'esAlfaNumerico', 'mensaje' => utf8_encode( 'El nombre es obligatorio.' ) ),
            'apellido' => array(
                'requerido' => 1, 'validador' => 'esAlfaNumerico', 'mensaje' => utf8_encode( 'El apellido es obligatoria.' ) ),
            'correo' => array(
                'requerido' => 1, 'validador' => 'esEmail', 'mensaje' => utf8_encode( 'El mail es obligatoria.' ) ),
            'telefono' => array(
                'requerido' => 1, 'validador' => 'esAlfaNumerico', 'mensaje' => utf8_encode( 'El telefono es obligatorio.' ) ),
            'fecha' => array(
                'requerido' => 1, 'validador' => 'esAlfaNumerico', 'mensaje' => utf8_encode( 'La fecha es obligatoria.' ) ),
            'horario' => array(
                'requerido' => 1, 'validador' => 'esAlfaNumerico', 'mensaje' => utf8_encode( 'El horario es obligatorio.' ) ),
            'sucursal' => array(
                'requerido' => 1, 'validador' => 'esAlfaNumerico', 'mensaje' => utf8_encode( 'La sucursal es obligatoria.' ) ),
            'medio' => array(
                'requerido' => 1, 'validador' => 'esAlfaNumerico', 'mensaje' => utf8_encode( 'El medio de contacto es obligatorio.' ) ),
            'mensaje' => array(
                'requerido' => 1, 'validador' => 'esAlfaNumerico', 'mensaje' => utf8_encode( 'El mensaje es obligatorio.' ) ),
        );

        $form = new Validator( $info, $parameters );

        // Si el formulario no es válido
        if ( !$form->validate() ) {

            $response = array(
                'success' => 'false',
                'message'=> $form->getMessage()
            );
        } else {

            try {

                $this->_PDOConn->beginTransaction();

                $info[ 'fecha' ] = date( "Y-m-d H:i:s" );

                $success    = $this->insert( $info );

                if ( $success ) {

                    $emails = explode( ',' , $correo );
                    $to     = array();

                    foreach ($emails as $email) {

                        $params = array(
                            'mail' => array(
                                'requerido' => 1 ,'validador' => 'esEmail', 'mensaje' => utf8_encode( 'El correo no es v&aacute;lido.' ) )
                        );

                        $destinatario = array(
                            'name' => $email,
                            'mail' => $email
                        );

                        $form   = new Validator( $destinatario, $params );
                        if ( ( $form->validate() ) === false ) {

                            throw new Exception('El correo ' . $email . ' no es v&aacute;lido.');
                        }
                        $to[] = $destinatario;
                    }

                    $vars = array(
                            'nombre'    => $info[ 'nombre' ],
                            'apellido'  => $info[ 'apellido' ],
                            'correo'    => $info[ 'correo' ],
                            'telefono'  => $info[ 'telefono' ],
                            'fecha'     => $info[ 'fecha' ],
                            'horario'   => $info[ 'horario' ],
                            'sucursal'  => $info[ 'sucursal' ],
                            'medio'     => $info[ 'medio' ],
                            'mensaje'   => $info[ 'mensaje' ]
                        );
                    $tpl = ParserTemplate::parseTemplate( $template, $vars );

                    $_cc    = $cc;

                    if ( Mailer::sendMail( $subject, $tpl, $to , '' , $_cc ) ) {

                        $response       = array (
                            'success' => 'true',
                            'message' => utf8_encode( 'Muchas gracias por ponerse en contacto con nosotros.' )
                        );
                    } else {

                        $response = array (
                            'success'=>'false',
                            'message'=>utf8_encode( 'El servicio de correo no esta disponible' )
                        );
                    }
                } else {

                    $response = array(
                        'success' => 'false',
                        'message' => utf8_encode('No fue posible guardar la información.')
                    );
                }

                $this->_PDOConn->commit();

            } catch ( PDOException $e ) {

                $this->_PDOConn->rollBack();
                $response   = array ( 'success'=>'false', 'msg'=>'el servicio de DB no esta disponible' );
            } catch ( phpmailerException $e ) {

                $this->_PDOConn->rollBack();
                $response   = array ( 'success'=>'false', 'msg'=>'el servicio de correo no esta disponible' );
            }
        }
        return $response;
    }
}
