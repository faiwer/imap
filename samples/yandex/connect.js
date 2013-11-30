(function()
{
	var button = document.getElementById('save');
	var loading = document.getElementById('loading');
	var preview = document.getElementById('preview');
	var map_class = 'site_imap_anchor';

	window.ymaps.ready( function()
	{
		button.onclick = function()
		{
			preview.innerHTML = window.test_editor.getData();
			var maps = preview.querySelectorAll( '.' + map_class );
			for( var i = 0, n = maps.length; i < n; ++ i )
			{
				var map = maps[ i ];
				replace( map );
			}
		};

		loading.style.display = 'none';
		button.style.visibility = 'visible';
	} );

	function replace( block )
	{
		var def =
		{
			zoom: 17,
			behaviors: [ 'default', 'scrollZoom' ],
			zoom_control: { left: 5, top: 5 },
			map_tools: { left: 35, top: 5 },
			preset: 'twirl#redStretchyIcon'
		};

		var plugin = block.attributes.getNamedItem('data-plugin').value;
		var cfg = JSON.parse( plugin );
		var coords = [ cfg._lon, cfg._lat ];
		var label = cfg._label;

		if( cfg._name )
		{
			block.setAttribute( 'imap_name', cfg._name );
		}
		if( cfg._width )
		{
			block.style.width = cfg._width;
		}
		if( cfg._height )
		{
			block.style.height = cfg._height;
		}

		block.id = 'ymap' + Math.random( 1, 9999 );
		block.__ymap = new ymaps.Map( block.id,
		{
			center: coords,
			zoom: cfg._zoom || def.zoom,
			behaviors: cfg._behaviors || def.behaviors,
		} );

		block.__ymap.controls
			.add( 'zoomControl', cfg._zoom_control || def.zoom_control )
			.add( 'typeSelector' )
			.add( 'mapTools', cfg._map_tools || def.map_tools );

		block.__point = new ymaps.GeoObject
		(
			{
				geometry: {
					type: 'Point',
					coordinates: coords
				},
				properties: { iconContent: cfg._label }
			},
			{ preset: def.preset }
		);

		block.__ymap.geoObjects.add( block.__point );
	}
} )();