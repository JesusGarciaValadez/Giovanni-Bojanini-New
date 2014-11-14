/**
 *
 *  @function
 *  @description:   Anonimous function autoexecutable
 *  @params jQuery $.- An jQuery object instance
 *  @params window window.- A Window object Instance
 *  @author: @_Chucho_
 *
 */
(function ( $, window, document, undefined ) {

    var _GBSite    = window._GBSite,
    // Use the correct document accordingly with window argument (sandbox)
    document    = window.document,
    location    = window.location,
    navigator   = window.navigator,
    // Map over GBSite in case of overwrite
    _GBSite    = window.GBSite;
    // Define a local copy of GBSite
    GBSite = function() {
        if ( !( this instanceof GBSite ) ) {
            // The GBSite object is actually just the init constructor 'enhanced'
            return new GBSite.fn.init();
        }
        return GBSite.fn.init();
    };

    GBSite.overlay;
    GBSite.closer;
    GBSite.radio;

    //  Object prototyping
    GBSite.fn = GBSite.prototype = {
        /**
         *
         *  @function:  !constructor
         *  @description:   Constructor method
         *  @author: @_Chucho_
         *
         */
        //  Método constructor
        constructor:    GBSite,
        /**
         *
         *  @function:  !init
         *  @description:   Inicializer method
         *  @author: @_Chucho_
         *
         */
        //  !Método inicializador
        init:                   function ( ) {
            GBSite.obtainActualDocument();
        },
        /**
         *
         *  @function:  !makesUniform
         *  @description:   Makes the uniform effect to radius and checkbox
         *  @params jQuery selector.- A jQuery Selector
         *  @see:   http://uniformjs.com/
         *  @author: @_Chucho_
         *
         */
        //  !Crea un efecto para poder dar estilos a los elementos checkbox,
        //  radio, file y select
        makesUniform:           function ( selector ) {
            _selector       = ( typeof( selector ) === "undefined" ) ? "*" : selector;
            _selector       = ( typeof( _selector ) === "object" ) ? _selector : $( _selector );
            _selector.uniform();
        },
        /**
         *
         *  @function:  !anchorMenu
         *  @description:   Anchor the menu
         *  @params jQuery selectorToApply.- A jQuery Selector
         *  @params Object toFix.- An object with css properties to apply to the
         *                         jQuery selector
         *  @params Object toDeFix.- An object with css properties to apply to
         *                         the jQuery selector
         *  @author: @_Chucho_
         *
         */
        //  !Ancla el menú cuando a una altura determinada mediante css
        anchorMenu:             function ( selectorToApply, offsetTop, cssToFix, cssToDeFix ) {
            GBSite.tool = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
            var _selector       = ( typeof( selectorToApply ) === "undefined" ) ? "*" : selectorToApply;
            _selector       = ( typeof( _selector ) === "object" ) ? _selector : $( _selector );
            var _offsetTop      = ( offsetTop === "" ) ? 0 : offsetTop;
            _offsetTop      = ( typeof( _offsetTop ) === "string" ) ? parseInt( _offsetTop ) : ( typeof( _offsetTop ) === "number" ) ? _offsetTop : parseInt( _offsetTop );
            var _cssToFix     = ( typeof( cssToFix ) === "object" ) ? cssToFix : {};
            var _cssToDeFix   = ( typeof( cssToDeFix ) === "object" ) ? cssToDeFix : {};
            if ( GBSite.tool >= _offsetTop ) {
                _selector.css( _cssToFix );
            } else {
                _selector.css( _cssToDeFix );
            }
        },
        /**
         *
         *  @function:  !validateContact
         *  @description:   Makes the validation of the contact form
         *  @see:   http://bassistance.de/jquery-plugins/jquery-plugin-validation/ ||
         *          http://docs.jquery.com/Plugins/Validation
         *  @author: @_Chucho_
         *
         */
        //  !Validación del formulario de contacto.
        validateForms:          function ( rule, messages ) {

            var _rule       = ( typeof( rule ) === 'object' ) ? rule : {};
            var _message    = ( typeof( messages ) === 'object' ) ? messages : {};

            var formActive  = $( 'form' ).validate( {
                onfocusout: false,
                onclick: true,
                onkeyup: false,
                onsubmit: true,
                focusCleanup: true,
                focusInvalid: false,
                errorClass: "error",
                validClass: "valid",
                errorElement: "label",
                ignore: "",
                /*showErrors: function( errorMap, errorList ) {
                    $('#message').empty().removeClass();
                    $("#message").html('<p>Error al ingresar la información.</p><p>Verifique que sus datos están correctos o que no falte ningún dato.</p><p>Por favor, vuelvalo a intentar.</p>');
                    $('#message').addClass('wrong').show('fast', function(){
                        $('#message').show('fast');
                    });
                    this.defaultShowErrors();
                },*/
                errorPlacement: function( error, element ) {
                    error.appendTo( element.parent() );
                },
                //debug:true,
                rules: _rule,
                messages: _message,
                highlight: function( element, errorClass, validClass ) {
                    $( element ).parent().addClass( 'error_wrapper' );
                },
                unhighlight: function( element, errorClass ) {
                    $( element ).parent().removeClass( 'error_wrapper' );
                },
                submitHandler: function( form ) {

                    // Form submit
                    $( form ).ajaxSubmit( {
                        //    Before submitting the form
                        beforeSubmit: function showRequestLogin( arr, form, options ) {

                            $('.error_indicator').remove();
                            if ( $('textarea' ).val() === "" ) {

                                $('textarea' ).val( 'Ninguno' );
                            }
                        },
                        //  !Function for handle data from server
                        success: function showResponseLogin( responseText, statusText, xhr, form ) {

                            //console.log(responseText.success);
                            responseText    = $.parseJSON( responseText );
                            var _title, _markup;

                            if( responseText && ( responseText.success === 'true' || responseText.success === true ) ) {

                                $( '.alert_box' ).addClass( 'thank_you_message' );
                                _title      = 'Gracias';
                                _markup     = '<p>Nos comunicaremos con usted a la brevedad.</p>';
                                GBSite.openAlert( _title, _markup );
                                $( 'textarea' ).val( "" );
                                //$( form ).fadeOut( 300 );
                            } else {

                                $( '.alert_box' ).addClass( 'error_message' );
                                _title  = 'Error';
                                _markup = '<p>La encuesta no fue procesada correctamente. Por favor, contacta al administrador.</p>';
                                GBSite.openAlert( _title, _markup );
                            }
                            //GBSite.smoothScroll( 'body' );
                        },
                        resetForm: false,
                        clearForm: false,
                        //   If something is wrong
                        error: function( jqXHR, textStatus, errorThrown ) {
                            //console.log(textStatus);
                            //console.log(errorThrown);
                            $( '.alert_box' ).addClass( 'error' );
                            var _title  = 'Error';
                            var _markup = '<p>La encuesta no fue procesada correctamente. Por favor, reporta este error al administrador.</p>';
                            GBSite.openAlert( _title, _markup );
                        },
                        cache: false
                    } );
                },
                /*invalidHandler: function(form, validator) {
                    var errors = validator.numberOfInvalids();
                    if (errors) {
                        var message = errors === 1 ? 'You missed 1 field. It has been highlighted' : 'You missed ' + errors + ' fields. They have been highlighted';
                        $("div#summary").html(message);
                        $("div#summary").show();
                    } else {
                        $("div#summary").hide();
                    }
                }*/
            } );
        },
        /**
         *
         *  @function:  !validateContact
         *  @description:   Makes the validation of the contact form
         *  @see:   http://bassistance.de/jquery-plugins/jquery-plugin-validation/ ||
         *          http://docs.jquery.com/Plugins/Validation
         *  @author: @_Chucho_
         *
         */
        //  !Validación del formulario de contacto.
        validateFormsAlter:         function ( dataPass ) {

            if ( $( '.select_level:checked' ).length === 0 ) {
                GBSite.openAlert( 'Error', '<p>Por favor, selecciona un tipo de alopecia.</p>' );
                return false;
            }

            //  Valida el nombre
            if ( !GBSite._validateMinLength( 2, dataPass.budget_name.length ) ) {
                GBSite.openAlert( 'Error', '<p>Por favor, escribe tu nombre.</p>' );
                return false;
            }

            //  Valida el teléfono
            if ( !GBSite._validateMinLength( 7, dataPass.budget_phone.length ) ) {
                GBSite.openAlert( 'Error', '<p>El número no debe tener menos de 8 caracteres.</p>' );
                return false;
            }
            if ( !GBSite._validateMaxLength( 20, dataPass.budget_phone.length ) ) {
                GBSite.openAlert( 'Error', '<p>El número no debe tener mas de 20 caracteres.</p>' );
                return false;
            }
            if ( !GBSite._validateNumber( dataPass.budget_phone ) ) {

                GBSite.openAlert( 'Error', '<p>Por favor, escribe sólo números.</p>' );
                return false;
            }

            //  Valida el correo
            if ( !GBSite._validateMinLength( 2, dataPass.budget_mail.length ) ) {
                GBSite.openAlert( 'Error', '<p>Por favor, escribe tu email.</p>' );
                return false;
            }
            if ( !GBSite._validateMail( dataPass.budget_mail ) ) {
                GBSite.openAlert( 'Error', '<p>Por favor, escribe un email válido.</p>' );
                return false;
            }

            $.ajax ( 'Code/snippets/dispatcher.php?action=sendBudget', {
                beforeSend: function ( jqXHR, settings ) {
                    $('.error_indicator').remove();
                    if ( $('textarea' ).val() === "" ) {

                        $('textarea' ).val( 'Ninguno' );
                    }
                },
                cache: false,
                complete: function ( jqXHR, textStatus ) {},
                contentType: "application/x-www-form-urlencoded",
                converters: {
                    "* text":       window.String,
                    "text html":    true,
                    "text json":    $.parseJSON,
                    "text xml":     $.parseXML
                },
                data: dataPass,
                error:  function ( jqXHR, textStatus, errorThrown ) {
                    $( '.alert_box' ).addClass( 'error_message' );
                    _title      = 'Error';
                    _markup     = '<p>Hubo un error. ¿Podrías intentarlo nuevamente?.</p>';
                    GBSite.openAlert( _title, _markup );
                },
                success: function ( responseText, textStatus, jqXHR ) {
                    //console.log(responseText.success);
                    var _title, _markup;

                    if ( $.parseJSON( responseText ) ) {

                        responseText    = $.parseJSON( responseText );

                        if( responseText && ( responseText.success === 'true' || responseText.success === true ) ) {

                            $( '.alert_box' ).addClass( 'thank_you_message' );
                            _title      = 'Gracias';
                            _markup     = '<p>Muchas gracias por tu interés en Giovanni Bojanini Microinjerto, <br />en breve nos pondremos en contacto contigo.</p>';
                            GBSite.openAlert( _title, _markup );
                            $( 'textarea' ).val( "" );
                            $( '.budget_form input[type="text"]' ).val( '' );
                            //$( form ).fadeOut( 300 );
                        } else {

                            $( '.alert_box' ).addClass( 'error_message' );
                            _title      = 'Error';
                            _markup     = '<p>Hubo un error. ¿Podría intentarlo nuevamente?.</p>';
                            GBSite.openAlert( _title, _markup );
                        }
                    } else {
                        $( '.alert_box' ).addClass( 'error_message' );
                        _title      = 'Error';
                        _markup     = '<p>Hubo un error. ¿Podría intentarlo nuevamente?.</p>';
                        GBSite.openAlert( _title, _markup );
                    }
                    //GBSite.smoothScroll( 'body' );
                },
                type: "POST"
            } );
        },
        validateFormsContact:       function ( dataPass ) {

            //  Valida el nombre
            if ( !GBSite._validateMinLength( 2, dataPass.nombre.length ) ) {
                GBSite.openAlert( 'Error', '<p>Por favor, escribe tu nombre.</p>' );
                return false;
            }

            //  Valida el apellido
            if ( !GBSite._validateMinLength( 2, dataPass.apellido.length ) ) {
                GBSite.openAlert( 'Error', '<p>Por favor, escribe tu apellido.</p>' );
                return false;
            }

            //  Valida el correo
            if ( !GBSite._validateMinLength( 2, dataPass.correo.length ) ) {
                GBSite.openAlert( 'Error', '<p>Por favor, escribe tu email.</p>' );
                return false;
            }
            if ( !GBSite._validateMail( dataPass.correo ) ) {
                GBSite.openAlert( 'Error', '<p>Por favor, escribe un email válido.</p>' );
                return false;
            }

            //  Valida el teléfono
            if ( !GBSite._validateMinLength( 7, dataPass.telefono.length ) ) {
                GBSite.openAlert( 'Error', '<p>El número no debe tener menos de 8 caracteres.</p>' );
                return false;
            }
            if ( !GBSite._validateMaxLength( 20, dataPass.telefono.length ) ) {
                GBSite.openAlert( 'Error', '<p>El número no debe tener mas de 20 caracteres.</p>' );
                return false;
            }
            if ( !GBSite._validateNumber( dataPass.telefono ) ) {
                GBSite.openAlert( 'Error', '<p>Por favor, escribe sólo números.</p>' );
                return false;
            }

            //  Valida si eres un paciente o no
            if ( !GBSite._validateMinLength( 0, dataPass.paciente.length ) ) {
                GBSite.openAlert( 'Error', '<p>Por favor, selecciona si eres un paciente o no.</p>' );
                return false;
            }
            if ( dataPass.sucursal ) {}

            //  Valida que se seleccione el método de ayuda
            if ( !GBSite._validateMinLength( 0, dataPass.ayuda.length ) ) {
                GBSite.openAlert( 'Error', '<p>Por favor, selecciona un tema de contacto.</p>' );
                return false;
            }

            //  Valida que se seleccione el medio de contacto
            if ( !GBSite._validateMinLength( 0, dataPass.medio.length ) ) {
                GBSite.openAlert( 'Error', '<p>Por favor, selecciona qué medio de contacto prefieres.</p>' );
                return false;
            }

            //  Valida que se escriba un mensaje
            if ( !GBSite._validateMinLength( 8, dataPass.mensaje.length ) ) {
                GBSite.openAlert( 'Error', '<p>Por favor, escribe tu mensaje para nosotros.</p>' );
                return false;
            }
            if ( !GBSite._validateMaxLength( 140, dataPass.mensaje.length ) ) {
                GBSite.openAlert( 'Error', '<p>Tu mensaje debe tener mas de 140 caracteres.</p>' );
                return false;
            }

            $.ajax ( 'Code/snippets/dispatcher.php?action=sendContact', {
                beforeSend: function ( ) {
                    $('.error_indicator').remove();
                    if ( $('textarea' ).val() === "" ) {

                        $('textarea' ).val( 'Ninguno' );
                    }
                },
                cache: false,
                complete: function ( ) {},
                contentType: "application/x-www-form-urlencoded",
                converters: {
                    "* text":       window.String,
                    "text html":    true,
                    "text json":    $.parseJSON,
                    "text xml":     $.parseXML
                },
                data: dataPass,
                error:  function () {
                    $( '.alert_box' ).addClass( 'error_message' );
                    _title      = 'Error';
                    _markup     = '<p>Hubo un error. ¿Podrías intentarlo nuevamente?.</p>';
                    GBSite.openAlert( _title, _markup );
                },
                success: function ( responseText ) {
                    //console.log(responseText.success);
                    var _title, _markup;

                    if ( $.parseJSON( responseText ) ) {

                        responseText    = $.parseJSON( responseText );

                        if( responseText && ( responseText.success === 'true' || responseText.success === true ) ) {

                            $( '.alert_box' ).addClass( 'thank_you_message' );
                            _title      = 'Gracias';
                            _markup     = '<p>Muchas gracias por tu interes en Giovani Bojanini Microinjerto, <br />en breve nos pondremos en contacto contigo.</p>';
                            GBSite.openAlert( _title, _markup );
                            $( 'textarea' ).val( "" );
                            $( 'form' ).reset();
                            //$( form ).fadeOut( 300 );
                        } else {

                            $( '.alert_box' ).addClass( 'error_message' );
                            _title      = 'Error';
                            _markup     = '<p>Hubo un error. ¿Podría intentarlo nuevamente?.</p>';
                            GBSite.openAlert( _title, _markup );
                        }
                    } else {
                        $( '.alert_box' ).addClass( 'error_message' );
                        _title      = 'Error';
                        _markup     = '<p>Hubo un error. ¿Podría intentarlo nuevamente?.</p>';
                        GBSite.openAlert( _title, _markup );
                    }
                    //GBSite.smoothScroll( 'body' );
                },
                type: "POST"
            } );
        },
        validateFormsAppointment:   function ( dataPass ) {

            //  Valida el nombre
            if ( !GBSite._validateMinLength( 2, dataPass.nombre.length ) ) {
                GBSite.openAlert( 'Error', '<p>Por favor, escribe tu nombre.</p>' );
                return false;
            }

            //  Valida el apellido
            if ( !GBSite._validateMinLength( 2, dataPass.apellido.length ) ) {
                GBSite.openAlert( 'Error', '<p>Por favor, escribe tu apellido.</p>' );
                return false;
            }

            //  Valida el correo
            if ( !GBSite._validateMinLength( 2, dataPass.correo.length ) ) {
                GBSite.openAlert( 'Error', '<p>Por favor, escribe tu email.</p>' );
                return false;
            }
            if ( !GBSite._validateMail( dataPass.correo ) ) {
                GBSite.openAlert( 'Error', '<p>Por favor, escribe un email válido.</p>' );
                return false;
            }

            //  Valida el teléfono
            if ( !GBSite._validateMinLength( 7, dataPass.telefono.length ) ) {
                GBSite.openAlert( 'Error', '<p>El número no debe tener menos de 8 caracteres.</p>' );
                return false;
            }
            if ( !GBSite._validateMaxLength( 20, dataPass.telefono.length ) ) {
                GBSite.openAlert( 'Error', '<p>El número no debe tener mas de 20 caracteres.</p>' );
                return false;
            }
            if ( !GBSite._validateNumber( dataPass.telefono ) ) {
                GBSite.openAlert( 'Error', '<p>Por favor, escribe sólo números.</p>' );
                return false;
            }

            //  Valida que se seleccione una fecha
            if ( $( "#contact_fecha" ).val() !== "" ) {

                if ( !GBSite._validateMinLength( 0, dataPass.fecha.length ) ) {
                    GBSite.openAlert( 'Error', '<p>Por favor, selecciona una fecha para tu cita.</p>' );
                    return false;
                }
                if ( !GBSite._validateDate( dataPass.fecha ) ) {
                    GBSite.openAlert( 'Error', '<p>Por favor, selecciona una fecha válida.</p>' );
                    return false;
                }
            }

            //  Valida que se seleccione el horario
            if ( !GBSite._validateMinLength( 0, dataPass.horario.length ) ) {
                GBSite.openAlert( 'Error', '<p>Por favor, selecciona que horario de consulta prefieres.</p>' );
                return false;
            }

            //  Valida que se seleccione una sucursal
            if ( !GBSite._validateMinLength( 0, dataPass.sucursal.length ) ) {
                GBSite.openAlert( 'Error', '<p>Por favor, selecciona que sucursal prefieres.</p>' );
                return false;
            }

            //  Valida que se seleccione el medio de contacto
            if ( !GBSite._validateMinLength( 0, dataPass.medio.length ) ) {
                GBSite.openAlert( 'Error', '<p>Por favor, selecciona que medio de contacto prefieres.</p>' );
                return false;
            }

            //  Valida que se escriba un mensaje
            if ( !GBSite._validateMinLength( 8, dataPass.mensaje.length ) ) {
                GBSite.openAlert( 'Error', '<p>Por favor, escribe tu mensaje para nosotros.</p>' );
                return false;
            }
            if ( !GBSite._validateMaxLength( 140, dataPass.mensaje.length ) ) {
                GBSite.openAlert( 'Error', '<p>Tu mensaje debe tener mas de 140 caracteres.</p>' );
                return false;
            }

            $.ajax ( 'Code/snippets/dispatcher.php?action=sendAppointment', {
                beforeSend: function ( ) {
                    $('.error_indicator').remove();
                    if ( $('textarea' ).val() === "" ) {

                        $('textarea' ).val( 'Ninguno' );
                    }
                },
                cache: false,
                complete: function ( ) {},
                contentType: "application/x-www-form-urlencoded",
                converters: {
                    "* text":       window.String,
                    "text html":    true,
                    "text json":    $.parseJSON,
                    "text xml":     $.parseXML
                },
                data: dataPass,
                error:  function () {
                    $( '.alert_box' ).addClass( 'error_message' );
                    _title      = 'Error';
                    _markup     = '<p>Hubo un error al enviar el formulario. ¿Podrías intentarlo nuevamente?.</p>';
                    GBSite.openAlert( _title, _markup );
                },
                success: function ( responseText ) {
                    //console.log(responseText.success);

                    var _title, _markup;

                    if ( $.parseJSON( responseText ) ) {

                        responseText    = $.parseJSON( responseText );

                        if( responseText && ( responseText.success === 'true' || responseText.success === true ) ) {

                            window.location.href    = 'http://www.giovannibojanini.com/agradecimiento.html';
                        } else {

                            $( '.alert_box' ).addClass( 'error_message' );
                            _title      = 'Error';
                            _markup     = '<p>Hubo un error. ¿Podría intentarlo nuevamente?.</p>';
                            GBSite.openAlert( _title, _markup );
                        }
                    } else {
                        $( '.alert_box' ).addClass( 'error_message' );
                        _title      = 'Error';
                        _markup     = '<p>Hubo un error. ¿Podría intentarlo nuevamente?.</p>';
                        GBSite.openAlert( _title, _markup );
                    }
                    //GBSite.smoothScroll( 'body' );
                },
                type: "POST"
            } );
        },
        /**
         *
         *  @function:  doOverlay
         *  @description:  Make and overlay effect
         *  @params jQuery selector.- A jQuery Selector
         *  @params Object options.- A JSON object with the options to make a
         *                           target element a jqdock Element
         *  @author: @_Chucho_
         *  @see:   http://jquerytools.org
         *
         */
        //  !Hace un efecto de overlay sobre un elemento determinado
        doOverlay:              function ( selector, options ) {
            var _selector   = ( typeof( selector ) === "string" )? $( selector ) : ( ( typeof( selector ) === "object" )? selector : $( '*' ) );
            var _options    = ( typeof( options )   === "object" )? options : {};

            _selector.overlay( _options );
        },
        //  !Abre un cuadro de diálogo con un mensaje
        openAlert:              function ( title, markupMessage ) {

            var _title      = ( title === "" || title === undefined ) ? "Error" : title;
            var _message    = ( markupMessage === "" || markupMessage === undefined ) ? "<p>Hubo un error inesperado.</p>" : markupMessage;

            $( '.alert_box h4' ).text( '' );
            $( '.alert_box p' ).remove( );
            $( '.alert_box form' ).remove( );
            $( '.alert_box table' ).remove( );
            $( '.alert_box div' ).remove( );
            $( '.alert_box button' ).remove( );

            if ( $( '.alert_box h2' ).exists() ) {

                $( '.alert_box h2' ).text( _title );
            } else {

                $( '.alert_box' ).append( '<h2>' + _title + '</h2>' );
            }
            $( '.alert_box' ).append( _message );
            //GBSite.overlay.load();
            $( '.alert_trigger' ).click( );
            $( '.alert_box' ).centerHeight( );
            $( '.alert_box' ).centerWidth( );
            $( '.alert_background' ).fadeIn( 50, function (  ) {

                $( '.alert_box' ).fadeIn( 100 );
            } );
        },
        /**
         *
         *  @function:  !closeAlert
         *  @description:   Close an alert box with a message
         *  @see:   http://bassistance.de/jquery-plugins/jquery-plugin-validation/ ||
         *          http://docs.jquery.com/Plugins/Validation
         *  @author: @_Chucho_
         *
         */
        //  !Cierra un cuadro de diálogo con un mensaje
        closeAlert:             function ( ) {

            if ( typeof( GBSite.closer ) !== 'undefined' ){
                GBSite.overlay.close();
            } else {
                if ( $( '#home' ).exists() ) {
                    $( '.alert_box' ).fadeOut( 150, function () {
                        $( '.alert_background' ).fadeOut( 'fast' );
                    } );
                } else {
                    $( '.alert_box' ).fadeOut( 150, function () {
                        $( '.alert_box h4' ).text( '' );
                        $( '.alert_box p' ).remove( );
                        $( '.alert_box form' ).remove( );
                        $( '.alert_box table' ).remove( );
                        $( '.alert_box div' ).remove( );
                        $( '.alert_box button' ).remove( );
    
                        $( '.alert_background' ).fadeOut( 'fast' );
                    } );
                }
            }
        },
        /**
         *
         *  @function:  !smoothScroll
         *  @description:   Do smooth scroll for the anchors in menu
         *  @params jQuery selector.- A jQuery Selector
         *  @params Number durationInSec.- A number to indicate the duration of
         *                                 the animation
         *  @see:   http://flesler.blogspot.com/2007/10/jqueryscrollto.html
         *  @author: @_Chucho_
         *
         */
        //  !Realiza el efecto para dar la impresión de scroll "suavizado"
        smoothScroll:           function ( selector, durationInSec ) {

            var _selector       = ( typeof( selector ) === "undefined" ) ? "*" : selector;
            _selector       = ( typeof( _selector ) === "object" ) ? _selector : ( typeof( _selector ) === "number" ) ? _selector : $( _selector );

            var _durationInSec  = ( durationInSec === "" ) ? 1000 : durationInSec;
            _durationInSec  = ( typeof( _durationInSec ) === "string" ) ? parseInt( _durationInSec ) : _durationInSec;
            _durationInSec  = ( typeof( _durationInSec ) !== "number" ) ? parseInt( _durationInSec ) : _durationInSec;
            var _scrollYOffset;

            if ( typeof( _selector ) === "object" ) {

                _scrollYOffset  = _selector.offset().top;
                _scrollYOffset  = Math.ceil ( Number( _scrollYOffset ) );
            } else if ( typeof( _selector ) === "number" ) {

                _scrollYOffset  = _selector;
            }

            $.scrollTo( _scrollYOffset, {
                duration: _durationInSec,
                axis: 'y'
            } );
        },
        /**
         *
         *  @function:  !toggleValue
         *  @description:   Does toggle if the input have a value or if doesn't
         *  @params jQuery selector.- A jQuery Selector
         *  @params String valueChange.- A String with the value to change or preserve
         *  @author: @_Chucho_
         *
         */
        //  !Revisa si el valor de un input es el original o no y lo preserva o
        //  respeta el nuevo valor.
        toggleValue:            function ( selector, valueChange ) {

            var _selector       = ( typeof( selector ) === "undefined" ) ? "*" : selector;
            _selector       = ( typeof( _selector ) === "object" ) ? _selector : $( _selector );

            var _valueChange  = ( valueChange === "" ) ? "" : valueChange;
            _valueChange  = ( typeof( _valueChange ) === "string" ) ? _valueChange : ( typeof( _valueChange ) === "number" ) ? parseInt( _valueChange ) : _valueChange;

            var _placeholder;

            if ( _selector.attr( 'placeholder' ) !== undefined ) {

                _placeholder = String ( _selector.attr( 'placeholder' ) ).toLowerCase();
            } else {

                _placeholder = String ( _selector.val( ) ).toLowerCase();
            }

            /*if ( ( _placeholder === "" ) || ( _placeholder === _valueChange ) ) {

                _selector.css( {
                    color: '#aaa'
                } );
            }*/

            var _comment;

            _selector.on( {
                blur: function ( e ) {
                    _comment    = String( $( e.currentTarget ).val() ).toLowerCase();
                    if ( ( _comment === _placeholder ) || ( _comment === "" ) ) {

                        $( e.currentTarget ).val( valueChange );
                        return false;
                    }
                },
                focus: function ( e ) {

                    _comment = String( $( e.currentTarget ).val() ).toLowerCase();
                    if ( _comment === _placeholder ) {

                        $( e.currentTarget ).val( '' );
                        return false;
                    }
                }
            } );
        },
        /**
         *
         *  @function:  !managerTimelineFill
         *  @description:   Carrousel inicializer
         *  @params jQuery slider.- A jQuery Selector
         *  @params String progressBar.- A class to add to target
         *  @params Object ui.- An object with css properties to apply to the jQuery selector
         *  @params Number leftOffset.- A number to indicate the duration of the animation
         *  @params Number rightOffset.- A number to indicate the duration of the animation
         *  @see:   http://jquerytools.org
         *  @author: @_Chucho_
         *
         */
        //  !Inicializador de un carrusel jQuery Tools
        inicializeCarrousel:    function ( selector, optionsScrollable, optionsNavigator, optionsAutoscroll ) {

            _selector       = ( typeof( selector )  === "undefined" ) ? "*" : selector;
            _selector       = ( typeof( _selector ) === "object" )    ? _selector : $( _selector );

            if( !optionsScrollable || optionsScrollable === {} ) {
                optionsScrollable = {};
            }
            if( !optionsNavigator || optionsNavigator === {} ) {
                optionsNavigator = {};
            }
            if( !optionsAutoscroll || optionsAutoscroll === {} ) {
                optionsAutoscroll = {};
            }

            _selector.scrollable( optionsScrollable ).navigator( optionsNavigator ).autoscroll( optionsAutoscroll );
        },
        /**
         *
         *  @function:  !toggleClass
         *  @description:   Toggle an HTML class
         *  @params jQuery selector.- A jQuery Selector
         *  @params String className.- A class to toggle to the target
         *  @author: @_Chucho_
         *
         */
        //  !Hace toggle de una clase a un selector específico
        toggleClass:            function ( selector, className ) {

            var _selector   = ( typeof( selector )  === "undefined" ) ? "*" : selector;
            _selector       = ( typeof( _selector ) === "object" )    ? _selector : $( _selector );
            var _class      = ( typeof( className ) === "undefined" ) ? ".active" : className;
            _class          = ( typeof( _class )    === "string" )    ? _class : String( _class );

            if ( selector.exists() ) {

                _selector.toggleClass( _class );
            }
        },
        /**
         *
         *  @function:  !obtainActualDocument
         *  @description:   Obtain name of the section from the url and puts an
         *                  active state in the correspondant link
         *  @author: @_Chucho_
         *
         */
        //  !Obtiene el nombre de la sección de la url y pone una clase al link correspondiente
        obtainActualDocument:   function ( ) {

            //  obtain url and determine wich function execute on base at name sectionn.
            var absolutePath        = window.location.href;
            var lastSlashPosition   = absolutePath.lastIndexOf( "/" );
            var relativePath        = absolutePath.substring( lastSlashPosition + "/".length , absolutePath.length );
            var waste               = relativePath.substring( relativePath.lastIndexOf( '.' ), relativePath.length );
            relativePath            = relativePath.replace( waste, '' );
            var _section            = new RegExp( "quienes-somos|testimoniales|directorio-medico|sucursales|contacto|agendar-cita|que-es-la-alopecia|tratamiento-integral|microinjerto|autodiagnosticate|dermocosmeticos|mesoterapia|electroporacion-capilar|plasma-rico-en-plaquetas|tratamiento-medico-farmacologico|clasificacion-de-la-calvicie|index*[^-]", "gi" );
            var _nameSection        = String( relativePath.match( _section ) );
            $( '.primary .sections li.current, .treatments li.current' ).removeClass( 'current' );

            switch ( _nameSection ) {
                case "que-es-la-alopecia":
                    $( '.treatments li' ).eq( 1 ).addClass( 'current' );
                    break;
                case "tratamiento-integral":
                case "mesoterapia":
                case "electroporacion-capilar":
                case "plasma-rico-en-plaquetas":
                case "tratamiento-medico-farmacologico":
                case "clasificacion-de-la-calvicie":
                    $( '.treatments li' ).eq( 2 ).addClass( 'current' );
                    break;
                case "microinjerto":
                    $( '.treatments li' ).eq( 3 ).addClass( 'current' );
                    break;
                case "dermocosmeticos":
                    $( '.treatments li' ).eq( 4 ).addClass( 'current' );
                    break;
                case "quienes-somos":
                    $( '.sections li.who_are_we' ).addClass( 'current' );
                    break;
                case "testimoniales":
                    $( '.sections li.testimonials' ).addClass( 'current' );
                    break;
                case "directorio-medico":
                    $( '.sections li.medical_directory' ).addClass( 'current' );
                    break;
                case "sucursales":
                    $( '.sections li.branches' ).addClass( 'current' );
                    break;
                case "contacto":
                case "agendar-cita":
                    $( '.sections li.contact' ).addClass( 'current' );
                    break;
                case "index":
                default:
                    $( '.treatments li' ).eq( 0 ).addClass( 'current' );
                    break;
            }
        },
        /**
         *
         *  @function:  !makeMapForContact
         *  @description:   Makes the call and construction of the Google Maps layer
         *  @params Number latitud.- A Number with the latitude of the point
         *  @params Number longitud.- A Number with the longitude of the point
         *  @params jQuery map.- A jQuery Selector
         *  @see:   https://developers.google.com/maps/documentation/javascript/reference?hl=es
         *  @author: @_Chucho_
         *
         */
        //  !Crea una instancia de Google Maps en una latitud y longitud dada.
        makeMapForContact:      function ( latitud, longitud, map, htmlMarkup ) {

            //    !Method for load Google Maps into the page
            var bounds          = new google.maps.LatLngBounds();
            var point           = new google.maps.LatLng( latitud, longitud );

            var latitudInfoWin  = Number( latitud ) + 0.0017;
            var longitudInfoWin = Number( longitud ) + 0.0050000;
            var infoWindowPos   = new google.maps.LatLng( latitudInfoWin, longitud );

            var options         = {
                zoom:                       15,
                disableDefaultUI:           true,
                disableDoubleClickZooom:    true,
                overviewMapControl:         false,
                panControl:                 false,
                rotateControl:              false,
                scaleControl:               false,
                scrollwheel:                false,
                draggable:                  false,
                keyboardShortcuts:          false,
                mapTypeControl:             false,
                mapTypeId:                  google.maps.MapTypeId.ROADMAP, //ROADMAP,
                center:                     point
            };
            var googleMap       = new google.maps.Map( map[0],options );

            bounds.extend( point );

            var marker          = new google.maps.Marker( {
                animation:  google.maps.Animation.DROP,
                position:   point,
                map:    googleMap,
                //icon: 'assets/img/markerBig.png'
            } );

            var infoWindow      = new google.maps.InfoWindow( {
                content:        htmlMarkup,
                disableAutoPan: false,
                maxWidth:       290,
                position:       infoWindowPos,
                //pixelOffset:    google.maps.Size( -100, -100, 'px', 'px' ),
                zIndex:         10
            } );
            infoWindow.open( googleMap );

            google.maps.event.addListener( marker, "click", function () {
                infoWindow.setContent( this.html );
                infoWindow.open( googleMap, this );
            } );
        },
        /**
         *
         *  @function:  !calculateNewHeight
         *  @description:   Calculate the height of a selector minus a given quantity of pixels
         *  @params jQuery selector | string.- A jQuery Selector
         *  @params Number point.- A Number with the quantity of pixels
         *  @author: @_Chucho_
         *
         */
        //  !Ajusta el alto del selector restando una cantidad de pixeles determinada
        calculateNewHeight:     function ( selector, point ) {

            _selector       = ( typeof( selector ) === "undefined" ) ? "*" : selector;
            _selector       = ( typeof( _selector ) === "object" ) ? _selector : $( _selector );
            _point          = ( typeof( point ) === "undefined" ) ? "*" : point;
            _point          = ( typeof( _point ) === "number" ) ? _point : $( _point );

            var windowHeight    = $( window ).innerHeight();
            var newHeight       = windowHeight - point;
            _selector.css( {
                height: newHeight
            } );
        },
        /**
         *
         *  @function:  !calculateNewWidth
         *  @description:   Calculate the width of a selector minus a given quantity of pixels
         *  @params jQuery selector | string.- A jQuery Selector
         *  @params Number point.- A Number with the quantity of pixels
         *  @author: @_Chucho_
         *
         */
        //  !Ajusta el ancho del selector restando una cantidad de pixeles determinada
        calculateNewWidth:      function ( selector, point ) {

            _selector       = ( typeof( selector ) === "undefined" ) ? "*" : selector;
            _selector       = ( typeof( _selector ) === "object" ) ? _selector : $( _selector );
            _point          = ( typeof( point ) === "undefined" ) ? "*" : point;
            _point          = ( typeof( _point ) === "number" ) ? _point : $( _point );

            var windowWidth    = $( window ).innerWidth();
            var newWidth       = windowWidth - point;
            _selector.css( {
                width: newWidth
            } );
        },
        obtainBranchInfoWindow: function ( selector ) {

            _selector       = ( typeof( selector ) === "undefined" ) ? "*" : selector;
            _selector       = ( typeof( _selector ) === "object" ) ? _selector : $( _selector );

            var branchTitle     = _selector.text();
            var branchLocation  = _selector.attr( 'data-location' );
            var branchPhone     = _selector.attr( 'data-phone' );
            var branchMail      = _selector.attr( 'data-mail' );

            var _markup         = '<div class="branch_infoWindow"><p class="branch_name">'+branchTitle+'</p><p class="branch_location">'+branchLocation+'</p><p class="branch_phone">'+branchPhone+'</p><a href="mailto:'+branchMail+'" title="'+branchMail+'" class="branch_mail">'+branchMail+'</p></div>';
            return _markup;
        },
        obtainBranchLatitude:   function ( selector ) {

            _selector       = ( typeof( selector ) === "undefined" ) ? "*" : selector;
            _selector       = ( typeof( _selector ) === "object" ) ? _selector : $( _selector );

            var branchLatitude  = _selector.attr( 'data-latitude' );
            return branchLatitude;
        },
        obtainBranchLongitude:  function ( selector ) {

            _selector       = ( typeof( selector ) === "undefined" ) ? "*" : selector;
            _selector       = ( typeof( _selector ) === "object" ) ? _selector : $( _selector );

            var branchLongitude  = _selector.attr( 'data-longitude' );
            return branchLongitude;
        },
        developMapInfoWindow:   function ( selector ) {

            _selector       = ( typeof( selector ) === "undefined" ) ? "*" : selector;
            _selector       = ( typeof( _selector ) === "object" ) ? _selector : $( _selector );
            localStorage.setItem( 'selector', _selector.selector );

            var branchLatitude      = GBSite.obtainBranchLatitude( _selector );
            var branchLongitude     = GBSite.obtainBranchLongitude( _selector );
            var branchInfoWindow    = GBSite.obtainBranchInfoWindow( _selector );

            GBSite.makeMapForContact( branchLatitude, branchLongitude, $( ".map" ), branchInfoWindow );
        },
        imageChange:            function ( parentIndex ) {

            $( '#wrapper_background figure.page.' + typeOfDevice + ' img:visible' ).dequeue().fadeOut( 150, function () {
                jQuery( '#wrapper_background figure.page.' + typeOfDevice ).children( 'img' ).eq( parentIndex ).fadeIn( 150 );
            } );

            $( '.banner_titles.' + window.typeOfDevice + ':visible' ).dequeue().fadeOut( 150, function () {
                $( '.banner_titles.' + window.typeOfDevice ).eq( parentIndex ).fadeIn( 150 );
            } );
        },
        goToSlide:              function ( slideh, slidev ) {
            Reveal.slide( slideh, slidev, 0 );
        },
        _validateMail:          function ( mail ) {
            return ( /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test( mail ) ) ? true : false;
        },
        _validateNumber:        function ( numberToCheck ) {
            return /^\d+[^a-zA-Z]+$/.test( parseInt( numberToCheck ) );
        },
        _validateRange:         function ( rangeTo, rangeFrom, valueToCheck ) {
            return ( rangeTo >= valueToCheck && rangeFrom <= valueToCheck ) ? true : false;
        },
        _validateMinLength:     function ( minLength, valueToCheck ) {
            return ( minLength < valueToCheck ) ? true : false;
        },
        _validateMaxLength:     function ( maxLength, valueToCheck ) {
            return ( valueToCheck <= maxLength ) ? true : false;
        },
        _validateDate:          function ( dateToCheck ) {
            return ( !/Invalid|NaN/.test(new Date(dateToCheck).toUTCString() ) ) ? true : false;
        },
        toggleMenu:             function ( e ){
            if ( $( 'aside .menu' ).hasClass( 'active' ) ) {
                
                $( 'aside .menu' ).removeClass( 'active');
            } else {
                
                $( 'aside .menu' ).addClass( 'active');
            }
            $( 'header nav' ).slideToggle( {
                duration: 150,
                easing: 'easeOutBounce',
                queue: false,
                specialEasing: {},
                step: function( now, tween ) {},
                progress: function( animation, progress, remainingMs ) {},
                complete: function() {},
                start: function( animation ) {},
                done: function( animation, jumpedToEnd ) {},
                fail: function( animation, jumpedToEnd ) {},
                alway: function( animation, jumpedToEnd ) {}
            } );
        }
    };

    // Give the init function the GBSite prototype for later instantiation
    GBSite.fn.init.prototype = GBSite.fn;

    GBSite = GBSite.fn;

    // Expose GBSite to the global object

    window.GBSite  = GBSite;

})( jQuery, window, document );
