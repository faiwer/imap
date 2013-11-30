"use strict";

(function()
{
	var plugin_name = 'imap';
	var lang_list = [ 'ru', 'en' ];

	if( CKEDITOR.plugins.get( plugin_name ) )
	{
		return false;
	}

	var dialog_name = plugin_name;
	var command = plugin_name;
	var button = command.charAt( 0 ).toUpperCase() + command.substr( 1 );
	var result_class = 'site_' + plugin_name + '_anchor';
	var img_class = 'cke_' + plugin_name;
	var obj_kind = plugin_name;
	var tag_name = 'em';
	var priority = 1;

	var create_fake_element = function( editor, real_el )
	{
		return editor.createFakeParserElement( real_el, img_class, obj_kind, true );
	};

	CKEDITOR.plugins.add( plugin_name,
	{
		requires: [ 'dialog', 'fakeobjects' ],
		icons: 'imap',
		hidpi: false,
		lang: lang_list,

		onLoad: function()
		{
			var css = 'img.' + img_class +
			'{' +
			'	-moz-box-sizing: border-box;' +
			'	-webkit-box-sizing: border-box;' +
			'	box-sizing: border-box;' +
			'	display: block;' +
			'	background: url(' + this.path + 'images/placeholder.png) ' +
					'no-repeat center center white;' +
			'	border: 1px solid #a9a9a9;' +
			'	min-width: 100px;' +
			'	min-height: 50px;' +
			'	margin: 5px 0 10px 0;' +
			'}';

			CKEDITOR.addCss( css );
		},

		init: function( editor )
		{
			var req = 'em' /* tag */ + '[!data-plugin,!width,!height]' /* attrs */ +
				'(' + result_class + ')' /* classes */ +
				'{width,height}' /* styles */;
			editor.addCommand( command, new CKEDITOR.dialogCommand( command,
			{
				allowedContent: req
			} ) );

			editor.ui.addButton( button,
			{
				label: editor.lang[ plugin_name ].button_label,
				command: command
			} );
			var dialog_path = this.path + 'dialogs/' + plugin_name + '.js';
			CKEDITOR.dialog.add( dialog_name, dialog_path );

			editor.on( 'doubleclick', function( e )
			{
				var element = e.data.element;

				if( element.is('img') &&
					element.data('cke-real-element-type') === obj_kind )
				{
					e.data.dialog = dialog_name;
				}
			} );
		},

		afterInit: function( editor )
		{
			var dataProcessor = editor.dataProcessor,
				dataFilter = dataProcessor && dataProcessor.dataFilter;

			if( ! dataFilter )
			{
				return;
			}

			var elements = {};
			elements[ tag_name ] = function( el )
			{
				if( el.classes && el.classes.indexOf( result_class ) !== -1 )
				{
					return create_fake_element( editor, el );
				}

				return null;
			};
			dataFilter.addRules( { elements: elements }, priority );
		}
	} );
} )();