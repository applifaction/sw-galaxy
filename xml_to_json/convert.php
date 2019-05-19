<?php
/**
 * Execute this script only from the shell
 */
$validFileNames = array(
    'Armor' => 'Armor.xml',
    'Weapon' => 'Weapons.xml',
    'ItemAttachments' => 'ItemAttachments.xml',
    'Gear' => 'Gear.xml',
    'Species' => 'Species.xml'
);
if (function_exists('apache_request_headers')) {
    print "<pre>";
}
foreach ($validFileNames as $typeKey => $fileName) {
    $xmlFilePattern = dirname(__FILE__) . '/xml_sources/*/' . $fileName;
    $xmlFiles = glob($xmlFilePattern, GLOB_BRACE);
    $jsonFile = dirname(__FILE__) . '/../data/json/' . preg_replace("/^(.*)\.xml$/", "$1.json", $fileName);
    $fileData = array($typeKey => array());
    /** @var string $xmlFile */
    foreach ($xmlFiles as $xmlFile) {
        /** @var SimpleXMLElement $data */
        $data = simplexml_load_string(file_get_contents($xmlFile));
        $data = json_decode(json_encode($data, JSON_NUMERIC_CHECK));
        $values = reset($data);
        foreach ($values as &$row) {
            if (isset($row->Key) && isset($row->Name) && strlen(trim($row->Name)) > 0) {
                if (empty($row->Key) || is_numeric($row->Key)) {
                    $row->Key = 'MISSING_KEY_' . strtoupper(preg_replace("/(\"|\'| |-)/", '_', $row->Name));
                }
                if (isset($fileData[$typeKey][$row->Key])) {
                    continue;
                }
                if (!isset($row->Description) || !is_string($row->Description)) {
                    $row->Description = "";
                }
                if (!isset($row->Descriptors) || !is_string($row->Descriptors)) {
                    unset($row->Descriptors);
                }
                if ($typeKey == 'Species' && isset($row->Source) && isset($row->Source->Page) && !is_numeric($row->Source->Page)) {
                    unset($row->Source->Page);
                }
//                if (isset($row->Sources) || empty($row->Sources)) {
//                    unset($row->Sources);
//                }
                $thumbnail = 'data/img/' . $typeKey . $row->Key . '.png';
                if (file_exists(dirname(__FILE__) . '/../' . $thumbnail)) {
                    $row->Thumbnail = $thumbnail;
                } else {
                    $row->Thumbnail = 'img/no_image.png';
                }
                $fileData[$typeKey][$row->Key] = $row;
                 print "$typeKey: ".$typeKey;
                 print "$row->Key: ".$row->Key;
                 print "$row: ". $row
            }
        }
        print "Read {$xmlFile}\n";
    }
    foreach ($fileData as $typeKey => $rows) {
        $fileData[$typeKey] = array_values($rows);
    }
    file_put_contents($jsonFile, json_encode($fileData));
    print "=> Wrote {$jsonFile}\n";
}
if (function_exists('apache_request_headers')) {
    print "</pre>";
}
print "XML to JSON File conversion finished!\n";