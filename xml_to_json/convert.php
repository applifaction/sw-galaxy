<?php
/**
 * Execute this script only from the shell
 */

$xmlFilePattern = dirname(__FILE__) . '/source_xml/*.xml';
$xmlFiles = glob($xmlFilePattern, GLOB_BRACE);
/** @var string $xmlFile */
foreach ($xmlFiles as $xmlFile) {
    /** @var SimpleXMLElement $data */
    $data = simplexml_load_string(file_get_contents($xmlFile));
    $jsonFile = dirname(__FILE__) . '/../data/json/' . preg_replace("/^(.*)\.xml$/", "$1.json", basename($xmlFile));
    $data = json_decode(json_encode($data, JSON_NUMERIC_CHECK));
    $key = key($data);
    $values = reset($data);
    foreach ($values as &$row) {
        if (isset($row->Key)) {
            $thumbnail = 'data/img/' . $key . $row->Key . '.png';
            if (file_exists(dirname(__FILE__) . '/../' . $thumbnail)) {
                $row->Thumbnail = $thumbnail;
            } else {
                $row->Thumbnail = 'img/no_image.png';
            }
        }
    }
    $data = array($key => $values);
    print "Wrote {$jsonFile}\n";
    file_put_contents($jsonFile, json_encode($data));
}
print "XML to JSON File conversion finished!\n";