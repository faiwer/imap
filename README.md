# Imap CKEditor plugin

This plugin add new button to CKEditor 4, which allow user to place maps into the HTML-page. Plugin have dialog, where user can specify the coordinates, label, title and zoom.

In editing-mode user use fake-IMG (like as flash-objects). Finally editor return HTML-code without map. But this code contains special tag with map configuration.

Code: `<em class="site_imap_anchor" data-plugin="%json%">MAP</em>`

For using this plugin you need convert this special-tag to map after editing code and when end-user loading page. See example connection with YandexMaps in `samples/` folder.
