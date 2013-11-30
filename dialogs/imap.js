(function()
{
	var plugin_name = 'imap';

	CKEDITOR.dialog.add( plugin_name, function( editor )
	{
		var result_class = 'site_' + plugin_name + '_anchor';
		var img_class = 'cke_' + plugin_name;
		var obj_kind = plugin_name;
		var data_attr = 'data-plugin';
		var tag_name = 'em';
		var inner_text = 'MAP';
		var lang = editor.lang[ plugin_name ];
		// map configs
		var zoom_max = 17; // yandex
		var zoom_min = 1;

		var commit = function( styles, attrs )
		{
			var value = this.getValue();

			if( this.id === 'width' || this.id === 'height' )
			{
				styles[ this.id ] = value;
			}
			else if( this.id === 'lat' || this.id === 'lon' )
			{
				value = value.replace( ',', '.' );
			}

			attrs[ '_' + this.id ] = value;
		};

		var load = function( cfg )
		{
			this.setValue( cfg[ '_' + this.id ] );
		};

		var validate_zoom = function( value )
		{
			var value = this.getValue();
			if( ! value.match( /^\d+$/ ) )
			{
				return lang.inc_zoom;
			}

			if( value < zoom_min || value > zoom_max )
			{
				return lang.inc_zoom;
			}

			return true;
		};

		var dialog =
		{
			title: lang.title,
			width: 300,
			height: 220,
			contents:
			[
				{
					id: 'tab_info',
					expand: true,
					padding: 0,
					elements:
					[
						{
							id: 'name',
							type: 'text',
							label: lang.f_name,
							commit: commit,
							setup: load
						},
						{
							id: 'label',
							type: 'text',
							label: lang.f_label,
							commit: commit,
							setup: load
						},
						{
							type: 'hbox',
							align: 'left',
							children:
							[
								{
									id: 'lon',
									type: 'text',
									label: lang.f_lat,
									require: true,
									commit: commit,
									validate: CKEDITOR.dialog.validate
										.regex( /^[\d\,\.]+$/, lang.inc_coord ),
									setup: load,
									'default': '43.2503'
								},
								{
									id: 'lat',
									type: 'text',
									label: lang.f_lon,
									require: true,
									commit: commit,
									validate: CKEDITOR.dialog.validate
										.regex( /^[\d\,\.]+$/, lang.inc_coord ),
									setup: load,
									'default': '76.9015'
								},
							],
						},
						{
							id: 'zoom',
							type: 'text',
							label: lang.f_zoom,
							require: true,
							commit: commit,
							validate: validate_zoom,
							setup: load,
							'default': '17',
						},
						{
							type: 'hbox',
							align: 'left',
							children:
							[
								{
									id: 'width',
									type: 'text',
									label: lang.f_width,
									require: true,
									commit: commit,
									setup: load,
									'default': '100%',
								},
								{
									id: 'height',
									type: 'text',
									label: lang.f_height,
									require: true,
									commit: commit,
									setup: load,
									'default': '300px',
								},
							],
						},
					]
				}
			],

			onShow: function()
			{
				// Clear previously saved elements.
				this.fake = this.node = null;

				var fake = this.getSelectedElement();
				if( fake && fake.data('cke-real-element-type') === obj_kind )
				{
					this.fake = fake;
					this.node = editor.restoreRealElement( fake );
					var cfg = JSON.parse( this.node.getAttribute( data_attr ) )
					this.setupContent( cfg );
				}
			},

			onOk: function()
			{
				if( ! this.fake )
				{
					var html =
						'<cke:' + tag_name + '>' +
							inner_text +
						'</cke:' + tag_name + '>';
					var node = CKEDITOR.dom.element
						.createFromHtml( html, editor.document );
					node.addClass( result_class );
				}
				else
				{
					var node = this.node;
				}

				// collect values
				var styles = {}, attrs = {};
				this.commitContent( styles, attrs );

				// prepare node
				node.setStyles( styles );
				node.$.setAttribute( data_attr, JSON.stringify( attrs ) );

				// prepare new fake_object
				var new_fake = editor.createFakeElement( node, img_class, obj_kind, true );
				new_fake.setAttributes( attrs );
				new_fake.setStyles( styles );

				// save
				if( this.fake_image )
				{
					new_fake.replace( this.fake );
					editor.getSelection().selectElement( new_fake );
				}
				else
				{
					editor.insertElement( new_fake );
				}
			}
		};
		return dialog;
	} );
} )();