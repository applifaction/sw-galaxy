## STAR WARS GALAXY

# [CLICK HERE TO USE THE WEB APP](https://ewebdevelopment.github.io/sw-galaxy)

This tool was made to support Star Wars FFG role players to find  weapons, armors and gear fast and easy.
This web application offers a lot of possibilities to search and filter the items.

This website is optimized for mobile devices. This enables the players to search for their preferred items
from their smartphones even when they are currently in a pen and paper session.

### Convert the XML data from OggDude Character Generator to JSON files for the STAR WARS GALAXY web application.

Just move following files from the `SWEotECharGen` folder into the folder `xml_to_json/xml_sources/oggdude` and execute
the php script `xml_to_json/convert.php` from a unix like shell like this: `php xml_to_json/convert.php`.

```
Data/Armor.xml
Data/Gear.xml
Data/ItemAttachments.xml
Data/Weapons.xml
```

If you are running a web server like apache or nginx, you can run the `convert.php` script with a http request too.

### Use multiple data sources

Multiple data sets can be merged too. Just create a new folder in `xml_to_json/xml_sources`. The name of the new folder is up to yours.
Then copy your custom XML files in. Currently following file names are supported: `Armor.xml`, `Gear.xml`, `ItemAttachments.xml`, `Weapons.xml`.
Then run the `convert.php` like described above.

### Please feel free to contribute!

Please feel free to add your improvements to this projects.
Even small changes like additional images for items are welcome.
To do so, fork this project and send us an merge request.

If you have ideas for new features or found an bug, please create an issue to let us know.

### Oh, Thanks!

Thank you OggDude for creating and offering your data and awesome [OggDude Character Generator](https://www.legendsofthegalaxy.com/Oggdude/) to us!