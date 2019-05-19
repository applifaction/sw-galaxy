var App = angular.module('SWApp', [
    'ngMaterial',
    'material.svgAssetsCache',
    'ngSanitize',
    'md.data.table',
    'fixed.table.header'
]);

App.config(function ($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('red');
});

App.filter('searchFilter', function () {
    return function (items, search, ctrl) {
        if (!search) {
            return items;
        }
        search = search.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
        var searchItems = search.split(' ');
        return items.filter(function (item) {
            var i, l = searchItems.length, pattern, found;
            for (i = 0; i < l; i++) {
                pattern = new RegExp(searchItems[i], "i");
                found = pattern.test(item.Name) ||
                pattern.test(item.Description) ||
                pattern.test(item.Damage) ||
                pattern.test(item.Crit) ||
                pattern.test(item.Rarity) ||
                pattern.test(item.Encumbrance) ||
                pattern.test(item.HP) ||
                pattern.test(item.Type) ||
                pattern.test(item.SkillKey) ||
                pattern.test(item.RangeValue) ||
                (typeof item.Qualities == 'object' && pattern.test(JSON.stringify(item.Qualities)));
                if (!found) {
                    return false;
                }
            }
            return true;
        });
    };
});

App.filter('fulltextFilter', function () {
    return function (items, search, attribute) {
        if (!search || typeof items.filter != 'function') {
            return items;
        }
        return items.filter(function (item) {
            return item[attribute] == search;
        });
    };
});

App.filter('trustAsHtmlFilter', function ($sce) {
    return function (text) {
        return $sce.trustAsHtml(text);
    };
});

App.filter('arrayFulltextFilter', function () {
    return function (items, searchItems, attribute, key) {
        if (!searchItems || searchItems.length == 0) {
            return items;
        }
        var i, l = searchItems.length, search;
        for (i = 0; i < l; i++) {
            search = searchItems[i];
            items = items.filter(function (item) {
                var i2, l2 = item[attribute].length;
                for (i2 = 0; i2 < l2; i2++) {
                    if (item[attribute][i2][key] == search) {
                        return true;
                    }
                }
                return false;
            });
        }
        return items;
    }
});

App.filter('arrayFulltextFilterOr', function () {
    return function (items, searchItems, attribute, key) {
        if (!searchItems || searchItems.length == 0) {
            return items;
        }
        items = items.filter(function (item) {
            var i2, l2 = item[attribute].length;
            for (i2 = 0; i2 < l2; i2++) {
                if (searchItems.indexOf(item[attribute][i2][key]) != -1) {
                    return true;
                }
            }
            return false;
        });
        return items;
    }
});
App.filter('nameFilter', function ($sce, $filter) {
 return function (item) {
        var html = '', mods = '', count;
        if (typeof item.Name == 'string') {
            html += "<div><strong>" + item.Name + "</strong></div>";
        }
	if (html.length > 0) {
            html = html.replace("[H3]" + item.Name + "[h3]", "");
            html = html.replace(/\[H3\]/g, "<div><em>");
            html = html.replace(/\[h3\]/g, "</em></div>");
            html = html.replace("[H4]" + item.Name + "[h4]", "");
            html = html.replace(/\[I\]/g, "<em>");
            html = html.replace(/\[i\]/g, "</em>");
            html = html.replace(/\[B\]/g, "<strong>");
            html = html.replace(/\[b\]/g, "</strong>");
            html = html.replace(/\[P\]/g, "</p><p>");
            html = html.replace(/\[BR\]/g, "<br/>");
            html = $filter('symbolFilter')(html);
            return $sce.trustAsHtml(html);
        } else {
            return null;
        }
    };
});

App.filter('descriptionFilter', function ($sce, $filter) {
    return function (item) {
        var html = '', mods = '', count;
    
       
        if (typeof item.Description == 'string') {
           html += "<p>" + item.Description + "</p>";
        }
               
        if (html.length > 0) {
            html = html.replace("[H3]" + item.Name + "[h3]", "");
            html = html.replace("[H4]" + item.Name + "[h4]", "");
            html = html.replace(/\[H3\]/g, "<div><em>");
            html = html.replace(/\[h3\]/g, "</em></div>");
            html = html.replace(/\[H4\]/g, "<div><em>");
            html = html.replace(/\[h4\]/g, "</em></div>");
            html = html.replace(/\[I\]/g, "<em>");
            html = html.replace(/\[i\]/g, "</em>");
            html = html.replace(/\[B\]/g, "<strong>");
            html = html.replace(/\[b\]/g, "</strong>");
            html = html.replace(/\[P\]/g, "</p><p>");
            html = html.replace(/\[p\]/g, "");
            html = html.replace(/\[BR\]/g, "<br/>");
            html = $filter('symbolFilter')(html);
            return $sce.trustAsHtml(html);
        } else {
            return null;
        }
    };
});

App.filter('infoFilter', function ($sce, $filter) {
    return function (item) {
        var html = '', mods = '', count;
    
        if (typeof item.BaseMods == 'object') {
            if (typeof item.BaseMods.Mod == 'object' && item.BaseMods.Mod.length > 0) {
                for (var i = 0, l = item.BaseMods.Mod.length; i < l; i++) {
                    if (typeof item.BaseMods.Mod[i].MiscDesc == 'string') {
                        mods += "<li>" + item.BaseMods.Mod[i].MiscDesc + "</li>";
                    } else {
                        if (typeof item.BaseMods.Mod[i].Key == 'string') {
                            count = '';
                            if (typeof item.BaseMods.Mod[i].Count == 'number' && item.BaseMods.Mod[i].Count != 0) {
                                count = item.BaseMods.Mod[i].Count + ' x ';
                            }
                            mods += "<li>" + count + $filter('modFilter')(item.BaseMods.Mod[i].Key) + "</li>";
                        } else {
                            console.log('debugging!');
                        }
                    }
                }
            } else {
                if (typeof item.BaseMods.Mod != 'undefined') {
                    if (typeof item.BaseMods.Mod.MiscDesc == 'string') {
                        mods += "<li>" + item.BaseMods.Mod.MiscDesc + "</li>";
                    } else {
                        if (typeof item.BaseMods.Mod.Key == 'string') {
                            count = '';
                            if (typeof item.BaseMods.Mod.Count == 'number' && item.BaseMods.Mod.Count != 0) {
                                count = item.BaseMods.Mod.Count + ' x ';
                            }
                            mods += "<li>" + count + $filter('modFilter')(item.BaseMods.Mod.Key) + "</li>";
                        } else {
                            console.log('debugging!');
                        }
                    }
                }
            }
            if (mods.length > 0) {
                html += "<p><strong>Base Mods:</strong></p><ul>" + mods + "</ul>";
            }
        }
        if (typeof item.AddedMods == 'object') {
            mods = '';
            if (typeof item.AddedMods.Mod == 'object' && item.AddedMods.Mod.length > 0) {
                for (i = 0, l = item.AddedMods.Mod.length; i < l; i++) {
                    if (typeof item.AddedMods.Mod[i].MiscDesc == 'string') {
                        mods += "<li>" + item.AddedMods.Mod[i].MiscDesc + "</li>";
                    } else {
                        if (typeof item.AddedMods.Mod[i].Key == 'string') {
                            count = '';
                            if (typeof item.AddedMods.Mod[i].Count == 'number' && item.AddedMods.Mod[i].Count != 0) {
                                count = item.AddedMods.Mod[i].Count + ' x ';
                            }
                            mods += "<li>" + count + $filter('modFilter')(item.AddedMods.Mod[i].Key) + "</li>";
                        } else {
                            console.log('debugging!');
                        }
                    }
                }
            } else {
                if (typeof item.AddedMods.Mod != 'undefined') {
                    if (typeof item.AddedMods.Mod.MiscDesc == 'string') {
                        mods += "<li>" + item.AddedMods.Mod.MiscDesc + "</li>";
                    } else {
                        if (typeof item.AddedMods.Mod.Key == 'string') {
                            count = '';
                            if (typeof item.AddedMods.Mod.Count == 'number' && item.AddedMods.Mod.Count != 0) {
                                count = item.AddedMods.Mod.Count + ' x ';
                            }
                            mods += "<li>" + count + $filter('modFilter')(item.AddedMods.Mod.Key) + "</li>";
                        } else {
                            console.log('debugging!');
                        }
                    }
                }
            }
            if (mods.length > 0) {
                html += "<p><strong>Additional Mods:</strong></p><ul>" + mods + "</ul>";
            }
        }
        if (html.length > 0) {
            html = html.replace("[H3]" + item.Name + "[h3]", "");
            html = html.replace("[H4]" + item.Name + "[h4]", "");
            html = html.replace(/\[H3\]/g, "<div><em>");
            html = html.replace(/\[h3\]/g, "</em></div>");
            html = html.replace(/\[H4\]/g, "<div><em>");
            html = html.replace(/\[h4\]/g, "</em></div>");
            html = html.replace(/\[I\]/g, "<em>");
            html = html.replace(/\[i\]/g, "</em>");
            html = html.replace(/\[B\]/g, "<strong>");
            html = html.replace(/\[b\]/g, "</strong>");
            html = html.replace(/\[P\]/g, "</p><p>");
            html = html.replace(/\[p\]/g, "");
            html = html.replace(/\[BR\]/g, "<br/>");
            html = $filter('symbolFilter')(html);
            return $sce.trustAsHtml(html);
        } else {
            return null;
        }
    };
});

App.filter('symbolFilter', function ($sce) {
    return function (text) {
        if (typeof text === 'string') {
            //[ABILITY] or [AB]
            text = text.replace(/\[(ABILITY|AB)\]/g, "<span class='sw-symbol sw-color-ability'>&#100;</span>");
            //[ADVANTAGE] or [AD]
            text = text.replace(/\[(ADVANTAGE|AD)\]/g, "<span class='sw-symbol'>&#97;</span>");
            //[BOOST] or [BO]
            text = text.replace(/\[(BOOST|BO)\]/g, "<span class='sw-symbol sw-color-boost'>&#98;</span>");
            //[CHALLENGE] or [CH]
            text = text.replace(/\[(CHALLENGE|CH)\]/g, "<span class='sw-symbol sw-color-challenge'>&#99;</span>");
            //[DARK] or [DA]
            text = text.replace(/\[(DARK|DA)\]/g, "<span class='sw-symbol'>&#122;</span>");
            //[DESPAIR] or [DE]
            text = text.replace(/\[(DESPAIR|DE)\]/g, "<span class='sw-symbol'>&#121;</span>");
            //[DIFFICULTY] or [DI]
            text = text.replace(/\[(DIFFICULTY|DI)\]/g, "<span class='sw-symbol sw-color-difficulty'>&#100;</span>");
            //[FORCEPOINT] or [FP]
            text = text.replace(/\[(FORCEPOINT|FP)\]/g, "<span class='sw-symbol'>&#70;</span>");
            //[FAILURE] or [FA]
            text = text.replace(/\[(FAILURE|FA)\]/g, "<span class='sw-symbol'>&#102;</span>");
            //[FORCE] or [FO]
            text = text.replace(/\[(FORCE|FO)\]/g, "<span class='sw-symbol'>&#67;</span>");
            //[LIGHT] or [LI]
            text = text.replace(/\[(LIGHT|LI)\]/g, "<span class='sw-symbol'>&#90;</span>");
            //[PROFICIENCY] or [PR]
            text = text.replace(/\[(PROFICIENCY|PR)\]/g, "<span class='sw-symbol sw-color-proficiency'>&#99;</span>");
            //[REMSETBACK] or [RS]
            //text = text.replace(/\[(REMSETBACK|RS)\]/g, "<span class='sw-symbol'></span>");
            //[RESTRICTED] or [RE]
            //text = text.replace(/\[(RESTRICTED|RE)\]/g, "<span class='sw-symbol'></span>");
            //[SETBACK] or [SE]
            text = text.replace(/\[(SETBACK|SE)\]/g, "<span class='sw-symbol'>&#98;</span>");
            //[SUCCESS] or [SU]
            text = text.replace(/\[(SUCCESS|SU)\]/g, "<span class='sw-symbol'>&#115;</span>");
            //[THREAT] or [TH]
            text = text.replace(/\[(THREAT|TH)\]/g, "<span class='sw-symbol'>&#116;</span>");
            //[TRIUMPH] or [TR]
            text = text.replace(/\[(TRIUMPH|TR)\]/g, "<span class='sw-symbol'>&#120;</span>");
            return text;
        } else {
            return '';
        }
    }
});

App.filter('skillFilter', function () {
    return function (text) {
        if (typeof text === 'string') {
            text = text.replace(/RANGLT/g, "Range Light");
            text = text.replace(/RANGHVY/g, "Range Heavy");
            text = text.replace(/GUNN/g, "Gunnery");
            text = text.replace(/MELEE/g, "Melee");
            text = text.replace(/MECH/g, "Mechanics");
            text = text.replace(/BRAWL/g, "Brawl");
            text = text.replace(/LTSABER/g, "Lightsaber");
            return text;
        } else {
            return '';
        }
    }
});

App.filter('rangeFilter', function () {
    return function (text) {
        if (typeof text === 'string') {
            text = text.replace(/wrClose/g, "Close");
            text = text.replace(/wrNoRange/g, "No Range");
            text = text.replace(/wrShort/g, "Short");
            text = text.replace(/wrMedium/g, "Medium");
            text = text.replace(/wrLong/g, "Long");
            text = text.replace(/wrExtreme/g, "Extreme");
            text = text.replace(/wrEngaged/g, "Engaged");
            return text;
        } else {
            return '';
        }
    }
});

App.filter('modFilter', function ($filter) {
    return function (text) {
        if (typeof text === 'string') {
            var initText = text;            
            text = $filter('descriptorFilter')(text);
            text = $filter('talentFilter')(text);
            text = $filter('symbolFilter')(text);
            if (initText == text) {
                console.log('Please add base mod mapping for: ' + text);
            }
            return text;
        } else {
            return '';
        }
    }
});

App.filter('descriptorFilter', function ($filter) {
    return function (text) {
        if (typeof text === 'string') {
            var initText = text;
            text = text.replace(/^DAMADD$/g, "Additional Damage Mod");
			text = text.replace(/^DAMSUB$/g, "Reduced Damage Mod");
			text = text.replace(/^DAMSET$/g, "Base Damage Mod");
			text = text.replace(/^RESDOSE$/g, "Increase doses by 1 Mod");
			text = text.replace(/^HOLSTER3$/g, "Hoster Weapon up to Encumbrance 3 Mod");
			text = text.replace(/^MOUNT3$/g, "Mount Weapon up to Encumbrance 3 Mod");
			text = text.replace(/^MOUNTRANGED4$/g, "Mount Ranged Weapon up to Encumbrance 4 Mod");
			text = text.replace(/^MOUNTADDL$/g, "Increase Allowable Mounted Weapon Encumbrance by 1 Mod");
			text = text.replace(/^CARRY1$/g, "Carry Items up to Encumbrance 1 Mod");
			text = text.replace(/^CARRY0$/g, "Carry Items of Encumbrance 0 Mod");
			text = text.replace(/^ADVADD$/g, "Add Advantage to Successful Check Mod");
			text = text.replace(/^SUCCADD$/g, "Add Success to Check Mod");
			text = text.replace(/^ADVADDCOM$/g, "Add Advantage to Combat Check Mod");
			text = text.replace(/^THRADD$/g, "Add Threat to Check Mod");
			text = text.replace(/^THRCANCEL$/g, "Cancel Threat from Check Mod");
			text = text.replace(/^UPGRADEDIFF$/g, "Upgrade Difficulty of Check Mod");
			text = text.replace(/^ADVADDINIT$/g, "Add Advantage to Initiative Check Mod");
			text = text.replace(/^HPADD$/g, "Add Hard Points Mod");
			text = text.replace(/^HPADD2$/g, "Add 2 Hard Points to Vehicle Mod");
			text = text.replace(/^HPSUB$/g, "Remove Hard Points from Item Mod");
			text = text.replace(/^CRITSET$/g, "Base Critical Rating Mod");
			text = text.replace(/^STRAINADD$/g, "Additional Strain Mod");
			text = text.replace(/^RANGEADD$/g, "Additional Range Mod");
			text = text.replace(/^RANGESUB$/g, "Reduced Range Mod");
			text = text.replace(/^ENCTOTSUB$/g, "Decreases Total Encumbrance Mod");
			text = text.replace(/^ENCSUB$/g, "Decreases Encumbrance Mod");
			text = text.replace(/^ENCSUB2$/g, "Decreases Encumbrance by 2 Mod");
			text = text.replace(/^ENCADD$/g, "Increases Encumbrance Mod");
			text = text.replace(/^ENCTADD$/g, "Increases Encumbrance Threshold Mod");
			text = text.replace(/^ENCTBRADD$/g, "Increases Brawn for Determining Encumbrance Threshold Mod");
			text = text.replace(/^ENCTADD3$/g, "Increases Encumbrance Threshold by 3 Mod");
			text = text.replace(/^ENCTSUB$/g, "Decreases Encumbrance Threshold Mod");
			text = text.replace(/^CRITSUB$/g, "Decrease Critical Mod");
			text = text.replace(/^SOAKADD$/g, "Increase Soak Mod");
			text = text.replace(/^MELEEDEFADD$/g, "Increase Melee Defense Mod");
			text = text.replace(/^RANGEDEFADD$/g, "Increase Ranged Defense Mod");
			text = text.replace(/^DEFADD$/g, "Increase Defense Mod");
			text = text.replace(/^SETBACKADD$/g, "Add Setback Mod");
			text = text.replace(/^SETBACKSUB$/g, "Remove Setback Mod");
			text = text.replace(/^BOOSTADD$/g, "Add Boost Mod");
			text = text.replace(/^DIFFSUBLONG$/g, "Decrease Long Range Difficulty Mod");
			text = text.replace(/^DIFFSUBLONGEXT$/g, "Decrease Long and Extreme Range Difficulty Mod");
			text = text.replace(/^NOSTUN$/g, "Cannot deal strain damage");
			text = text.replace(/^HEALPLUSONE$/g, "Successful Medicine checks heal +1 wound Mod");
			text = text.replace(/^USERANGLT$/g, "Weapon's skill changes to Ranged-Light Mod");
			text = text.replace(/^USERANGHVY$/g, "Weapon's skill changes to Ranged-Heavy Mod");
			text = text.replace(/^ADDCRYSTNC$/g, "Add Additional Crystal with no HP Cost Mod");
			text = text.replace(/^PRICEHALF$/g, "Item is Half Price Mod");
			text = text.replace(/^PRICE20000$/g, "Add 20,000 Credits to Price Mod");
			text = text.replace(/^SEAL$/g, "Sealable Mod");
			text = text.replace(/^SEALED$/g, "Sealed Mod");
			text = text.replace(/^RANGEREDMED$/g, "Reduce Range to Medium Mod");
			text = text.replace(/^DEMONMASK$/g, "Demon Mask");
			text = text.replace(/^MEDFOCUS$/g, "Meditation Focus");
			text = text.replace(/^IRONFIST$/g, "Iron Fists");
			text = text.replace(/^FORCEADD$/g, "Add Force Rating Mod");
			text = text.replace(/^FORCESUB$/g, "Subtract from Force Rating Mod");
			text = text.replace(/^CYBERADD$/g, "Add to Cybernetics Cap Mod");
			text = text.replace(/^CYBERSUB$/g, "Subtract from Cybernetics Cap Mod");
			text = text.replace(/^CYBERNONE$/g, "Does not count toward Cybernetics Cap Mod");
			text = text.replace(/^JURYADD$/g, "May Select Additional Jury Rigged Option Mod");
			text = text.replace(/^SILHADD$/g, "Increase Silhouette Mod");
			text = text.replace(/^ARMORADD$/g, "Increase Armor Mod");
			text = text.replace(/^HANDLINGSUB$/g, "Decreases Handling Mod");
			text = text.replace(/^HANDLINGADD$/g, "Increases Handling Mod");
			text = text.replace(/^SSTRAINSUB$/g, "Decreases System Strain Mod");
			text = text.replace(/^SSTRAINSUB2$/g, "Decreases System Strain by 2 Mod");
			text = text.replace(/^SSTRAINADD$/g, "Increases System Strain Mod");
			text = text.replace(/^SSTRAINADDSIL$/g, "Increases System Strain by Silhouette Mod");
			text = text.replace(/^DEFZONEADD$/g, "Increase Defense Zone Mod");
			text = text.replace(/^SMUGENC$/g, "Convert 25 encumbrance capacity to smuggling compartment Mod");
			text = text.replace(/^HANGER$/g, "Retrofits Hangar Bay Mod");
			text = text.replace(/^HANGERSIZE$/g, "Increase Silhouette Capacity of Hangar Bay by 1 Mod");
			text = text.replace(/^HYPERDRIVESUB$/g, "Decreases Hyperdrive Class by 1, to a minimum of 1 Mod");
			text = text.replace(/^HYPERDRIVESUB5$/g, "Decreases Hyperdrive Class by 1, to a minimum of .5 Mod");
			text = text.replace(/^HYPERDRIVEBACKSUB5$/g, "Decreases Backup Hyperdrive Class by 1, to a minimum of .5 Mod");
			text = text.replace(/^HYPERDRIVEBACKSUB$/g, "Decreases Backup Hyperdrive Class by 1, to a minimum of 1 Mod");
			text = text.replace(/^HYPERDRIVEADD8$/g, "Add Class 8 Hyperdrive Mod");
			text = text.replace(/^HYPERDRIVEADD4$/g, "Add Class 4 Hyperdrive Mod");
			text = text.replace(/^HYPERDRIVEADDBACK14$/g, "Add Class 14 Backup Hyperdrive Mod");
			text = text.replace(/^MASSIVEADD$/g, "Add to Massive Mod");
			text = text.replace(/^MASSIVESET$/g, "Change Massive Mod");
			text = text.replace(/^ADDALT50$/g, "Increase Altitude by 50 Mod");
			text = text.replace(/^SETDEFFORE$/g, "Sets Forward Defense Mod");
			text = text.replace(/^SETDEFAFT$/g, "Sets Aft Defense Mod");
			text = text.replace(/^SETDEFPORT$/g, "Sets Port Defense Mod");
			text = text.replace(/^SETDEFSTAR$/g, "Sets Starboard Defense Mod");
			text = text.replace(/^SETDEFFORECRAFT$/g, "Sets Forward Defense When Crafting Mod");
			text = text.replace(/^SETDEFAFTCRAFT$/g, "Sets Aft Defense When Crafting Mod");
			text = text.replace(/^SETDEFPORTCRAFT$/g, "Sets Port Defense When Crafting Mod");
			text = text.replace(/^SETDEFSTARCRAFT$/g, "Sets Starboard Defense When Crafting Mod");
			text = text.replace(/^SETHAND$/g, "Sets Handling Mod");
			text = text.replace(/^SETHANDCRAFT$/g, "Sets Handling When Crafting Mod");
			text = text.replace(/^SETSSTRAIN$/g, "Sets System Strain Mod");
			text = text.replace(/^SETSSTRAINSIL$/g, "Sets System Strain to Silhouette Mod");
			text = text.replace(/^SETSSTRAINSILCRAFT$/g, "Sets System Strain When Crafting to Silhouette Mod");
			text = text.replace(/^SETSPEED$/g, "Sets Speed Mod");
			text = text.replace(/^SETSPEEDCRAFT$/g, "Sets Speed When Crafting Mod");
			text = text.replace(/^SETARMOR$/g, "Sets Armor Mod");
			text = text.replace(/^SETARMORCRAFT$/g, "Sets Armor Value When Crafting Mod");
			text = text.replace(/^ADDDEFFORE$/g, "Increase Forward Defense Mod");
			text = text.replace(/^ADDDEFPORT$/g, "Increase Port Defense Mod");
			text = text.replace(/^ADDDEFSTAR$/g, "Increase Starboard Defense Mod");
			text = text.replace(/^ADDDEFAFT$/g, "Increase Aft Defense Mod");
			text = text.replace(/^SPEEDSUB$/g, "Decrease Speed Mod");
			text = text.replace(/^SPEEDADD$/g, "Increase Speed Mod");
			text = text.replace(/^SPEEDADD2$/g, "Increases Speed by 2 Mod");
			text = text.replace(/^SRANGEADD$/g, "Additional Sensor Range Mod");
			text = text.replace(/^SRANGESUB$/g, "Reduced Sensor Range Mod");
			text = text.replace(/^CRANGEADD$/g, "Additional Comms Range Mod");
			text = text.replace(/^CRANGESUB$/g, "Reduced Comms Range Mod");
			text = text.replace(/^HULLADDSIL$/g, "Increase Hull Trauma by Silhouette Mod");
			text = text.replace(/^HULLADD$/g, "Increase Hull Trauma Mod");
			text = text.replace(/^HULLADD3$/g, "Increase Hull Trauma by 3 Mod");
			text = text.replace(/^HULLSUB$/g, "Decrease Hull Trauma Mod");
			text = text.replace(/^PASSADD$/g, "Increase Passenger Capacity Mod");
			text = text.replace(/^PASSADDCRAFT$/g, "Increase Passenger Capacity When Crafting Mod");
			text = text.replace(/^PASSADD2$/g, "Increase Passenger Capacity by 2 Mod");
			text = text.replace(/^PASSADD10$/g, "Increase Passenger Capacity by 10 Mod");
			text = text.replace(/^PASSADDSIL$/g, "Increase Passenger Capacity by Silhouette Mod");
			text = text.replace(/^PASSSUB$/g, "Decrease Passenger Capacity Mod");
			text = text.replace(/^ADDSILWEAP$/g, "Vehicle can carry a weapon for craft 1 silhouette larger Mod");
			text = text.replace(/^BOARDTUBETIME$/g, "Decrease time to cut through hull by 1 round Mod");
			text = text.replace(/^DAMWEAPSYSADD$/g, "Increase damage of weapon system by one Mod");
			text = text.replace(/^ENCCADDSIL$/g, "Increases Encumbrance Capacity by Silhouette Mod");
			text = text.replace(/^ENCCADD$/g, "Increases Encumbrance Capacity Mod");
			text = text.replace(/^ENCCADDCRAFT$/g, "Increases Encumbrance Capacity When Crafting Mod");
			text = text.replace(/^ENCCADD100$/g, "Increases Encumbrance Capacity by 100 Mod");
			text = text.replace(/^ENCCSUB$/g, "Decreases Encumbrance Capacity Mod");
			text = text.replace(/^UPGUNN$/g, "Upgrade ability of Gunnery checks Mod");
			text = text.replace(/^VAKSAI$/g, "Replace Light Blaster Cannons with Light Laser Cannons Mod");
			text = text.replace(/^ACCURATE$/g, "Accurate Quality");
			text = text.replace(/^AUTOFIRE$/g, "Auto-Fire Quality");
			text = text.replace(/^BREACH$/g, "Breach Quality");
			text = text.replace(/^BURN$/g, "Burn Quality");
			text = text.replace(/^BLAST$/g, "Blast Quality");
			text = text.replace(/^CONCUSSIVE$/g, "Concussive Quality");
			text = text.replace(/^CORTOSIS$/g, "Cortosis Quality");
			text = text.replace(/^CUMBERSOME$/g, "Cumbersome Quality");
			text = text.replace(/^DEFENSIVE$/g, "Defensive Quality");
			text = text.replace(/^DEFLECTION$/g, "Deflection Quality");
			text = text.replace(/^DISORIENT$/g, "Disorient Quality");
			text = text.replace(/^ENSNARE$/g, "Ensnare Quality");
			text = text.replace(/^GUIDED$/g, "Guided Quality");
			text = text.replace(/^KNOCKDOWN$/g, "Knockdown Quality");
			text = text.replace(/^INACCURATE$/g, "Inaccurate Quality");
			text = text.replace(/^INFERIOR$/g, "Inferior Quality");
			text = text.replace(/^ION$/g, "Ion Quality");
			text = text.replace(/^LIMITEDAMMO$/g, "Limited Ammo Quality");
			text = text.replace(/^LINKED$/g, "Linked Quality");
			text = text.replace(/^PIERCE$/g, "Pierce Quality");
			text = text.replace(/^PREPARE$/g, "Prepare Quality");
			text = text.replace(/^SLOWFIRING$/g, "Slow Firing Quality");
			text = text.replace(/^STAGGER$/g, "Stagger Quality");
			text = text.replace(/^STUN$/g, "Stun Quality");
			text = text.replace(/^STUNDROID$/g, "Stun (Droid Only) Quality");
			text = text.replace(/^STUNSETTING$/g, "Stun Setting Quality");
			text = text.replace(/^STUNDAMAGE$/g, "Stun Damage Quality");
			text = text.replace(/^STUNDAMAGEDROID$/g, "Stun Damage (Droid Only) Quality");
			text = text.replace(/^SUNDER$/g, "Sunder Quality");
			text = text.replace(/^SUPERIOR$/g, "Superior Quality");
			text = text.replace(/^TRACTOR$/g, "Tractor Quality");
			text = text.replace(/^VICIOUS$/g, "Vicious Quality");
			text = text.replace(/^VICIOUSDROID$/g, "Vicious (Droid Only) Quality");
			text = text.replace(/^UNWIELDY$/g, "Unwieldy Quality");
			text = text.replace(/^QUALADVSUB$/g, "Quality Takes One Less Advantage to Activate Mod");
			text = text.replace(/^AUTOFIREADV$/g, "Autofire Takes One Less Advantage to Activate Mod");
			text = text.replace(/^BURNADV$/g, "Burn Takes One Less Advantage to Activate Mod");
			text = text.replace(/^BLASTADV$/g, "Blast Takes One Less Advantage to Activate Mod");
			text = text.replace(/^CONCUSSIVEADV$/g, "Concussive Takes One Less Advantage to Activate Mod");
			text = text.replace(/^DISORIENTADV$/g, "Disorient Takes One Less Advantage to Activate Mod");
			text = text.replace(/^ENSNAREADV$/g, "Ensnare Takes One Less Advantage to Activate Mod");
			text = text.replace(/^GUIDEDADV$/g, "Guided Takes One Less Advantage to Activate Mod");
			text = text.replace(/^KNOCKDOWNADV$/g, "Knockdown Takes One Less Advantage to Activate Mod");
			text = text.replace(/^LINKEDADV$/g, "Linked Takes One Less Advantage to Activate Mod");
			text = text.replace(/^STUNADV$/g, "Stun Takes One Less Advantage to Activate Mod");
			text = text.replace(/^SUNDERADV$/g, "Sunder Takes One Less Advantage to Activate Mod");
            if (initText == text) {
                console.log('Please add base mod mapping for: ' + text);
            }
            return text;
        } else {
            return '';
        }
    }
});

App.filter('talentFilter', function ($filter) {
    return function (text) {
        if (typeof text === 'string') {
            var initText = text;
            text = text.replace(/^ADV$/g, "Adversary");
			text = text.replace(/^ANAT$/g, "Anatomy Lessons");
			text = text.replace(/^ALLTERDRIV$/g, "All-Terrain Driver");
			text = text.replace(/^ARM$/g, "Armor Master");
			text = text.replace(/^ARMIMP$/g, "Armor Master (Improved)");
			text = text.replace(/^BACT$/g, "Bacta Specialist");
			text = text.replace(/^BADM$/g, "Bad Motivator");
			text = text.replace(/^BAL$/g, "Balance");
			text = text.replace(/^BAR$/g, "Barrage");
			text = text.replace(/^BASICTRAIN$/g, "Basic Combat Training");
			text = text.replace(/^BLA$/g, "Black Market Contacts");
			text = text.replace(/^BLO$/g, "Blooded");
			text = text.replace(/^BLOIMP$/g, "Blooded (Improved)");
			text = text.replace(/^BOD$/g, "Body Guard");
			text = text.replace(/^BOUGHT$/g, "Bought Info");
			text = text.replace(/^BRA$/g, "Brace");
			text = text.replace(/^BRI$/g, "Brilliant Evasion");
			text = text.replace(/^BYP$/g, "Bypass Security");
			text = text.replace(/^CAREPLAN$/g, "Careful Planning");
			text = text.replace(/^CLEVERSOLN$/g, "Clever Solution");
			text = text.replace(/^COD$/g, "Codebreaker");
			text = text.replace(/^COM$/g, "Command");
			text = text.replace(/^COMMPRES$/g, "Commanding Presence");
			text = text.replace(/^CONF$/g, "Confidence");
			text = text.replace(/^CONT$/g, "Contraption");
			text = text.replace(/^CONV$/g, "Convincing Demeanor");
			text = text.replace(/^COORDASS$/g, "Coordinated Assault");
			text = text.replace(/^CREATKILL$/g, "Creative Killer");
			text = text.replace(/^CRIPV$/g, "Crippling Blow");
			text = text.replace(/^DEAD$/g, "Dead to Rights");
			text = text.replace(/^DEADIMP$/g, "Dead to Rights (Improved)");
			text = text.replace(/^DEADACC$/g, "Deadly Accuracy");
			text = text.replace(/^DEPSHOT$/g, "Debilitating Shot");
			text = text.replace(/^DEDI$/g, "Dedication");
			text = text.replace(/^DEFDRI$/g, "Defensive Driving");
			text = text.replace(/^DEFSLI$/g, "Defensive Slicing");
			text = text.replace(/^DEFSLIIMP$/g, "Defensive Slicing (Improved)");
			text = text.replace(/^DEFSTA$/g, "Defensive Stance");
			text = text.replace(/^DISOR$/g, "Disorient");
			text = text.replace(/^DODGE$/g, "Dodge");
			text = text.replace(/^DURA$/g, "Durable");
			text = text.replace(/^DYNFIRE$/g, "Dynamic Fire");
			text = text.replace(/^ENDUR$/g, "Enduring");
			text = text.replace(/^EXHPORT$/g, "Exhaust Port");
			text = text.replace(/^EXTRACK$/g, "Expert Tracker");
			text = text.replace(/^FAMSUNS$/g, "Familiar Suns");
			text = text.replace(/^FERSTR$/g, "Feral Strength");
			text = text.replace(/^FLDCOMM$/g, "Field Commander");
			text = text.replace(/^FLDCOMMIMP$/g, "Field Commander (Improved)");
			text = text.replace(/^FINETUN$/g, "Fine Tuning");
			text = text.replace(/^FIRECON$/g, "Fire Control");
			text = text.replace(/^FORAG$/g, "Forager");
			text = text.replace(/^FORCEWILL$/g, "Force of Will");
			text = text.replace(/^FORCERAT$/g, "Force Rating");
			text = text.replace(/^FORMONME$/g, "Form On Me");
			text = text.replace(/^FRENZ$/g, "Frenzied Attack");
			text = text.replace(/^FULLSTOP$/g, "Full Stop");
			text = text.replace(/^FULLTH$/g, "Full Throttle");
			text = text.replace(/^FULLTHIMP$/g, "Full Throttle (Improved)");
			text = text.replace(/^FULLTHSUP$/g, "Full Throttle (Supreme)");
			text = text.replace(/^GALMAP$/g, "Galaxy Mapper");
			text = text.replace(/^GEARHD$/g, "Gearhead");
			text = text.replace(/^GREASE$/g, "Greased Palms");
			text = text.replace(/^GRIT$/g, "Grit");
			text = text.replace(/^HARDHD$/g, "Hard Headed");
			text = text.replace(/^HARDHDIMP$/g, "Hard Headed (Improved)");
			text = text.replace(/^HEIGHT$/g, "Heightened Awareness");
			text = text.replace(/^HERO$/g, "Heroic Fortitude");
			text = text.replace(/^HIDD$/g, "Hidden Storage");
			text = text.replace(/^HOLDTOG$/g, "Hold Together");
			text = text.replace(/^HUNT$/g, "Hunter");
			text = text.replace(/^INCITE$/g, "Incite Rebellion");
			text = text.replace(/^INDIS$/g, "Indistinguishable");
			text = text.replace(/^INSIGHT$/g, "Insight");
			text = text.replace(/^INSPRHET$/g, "Inspiring Rhetoric");
			text = text.replace(/^INSPRHETIMP$/g, "Inspiring Rhetoric (Improved)");
			text = text.replace(/^INSPRHETSUP$/g, "Inspiring Rhetoric (Supreme)");
			text = text.replace(/^INTENSFOC$/g, "Intense Focus");
			text = text.replace(/^INTENSPRE$/g, "Intense Presence");
			text = text.replace(/^INTIM$/g, "Intimidating");
			text = text.replace(/^INVENT$/g, "Inventor");
			text = text.replace(/^INVIG$/g, "Invigorate");
			text = text.replace(/^ITSNOTTHATBAD$/g, "It's Not that Bad");
			text = text.replace(/^JUMP$/g, "Jump Up");
			text = text.replace(/^JURY$/g, "Jury Rigged");
			text = text.replace(/^KILL$/g, "Kill With Kindness");
			text = text.replace(/^KNOCK$/g, "Knockdown");
			text = text.replace(/^KNOWSOM$/g, "Know Somebody");
			text = text.replace(/^KNOWSPEC$/g, "Knowledge Specialization");
			text = text.replace(/^KNOWSCH$/g, "Known Schematic");
			text = text.replace(/^LETSRIDE$/g, "Let's Ride");
			text = text.replace(/^LETHALBL$/g, "Lethal Blows");
			text = text.replace(/^MASDOC$/g, "Master Doctor");
			text = text.replace(/^MASDRIV$/g, "Master Driver");
			text = text.replace(/^MASGREN$/g, "Master Grenadier");
			text = text.replace(/^MASLEAD$/g, "Master Leader");
			text = text.replace(/^MASMERC$/g, "Master Merchant");
			text = text.replace(/^MASSHAD$/g, "Master of Shadows");
			text = text.replace(/^MASPIL$/g, "Master Pilot");
			text = text.replace(/^MASSLIC$/g, "Master Slicer");
			text = text.replace(/^MASSTAR$/g, "Master Starhopper");
			text = text.replace(/^MENTFOR$/g, "Mental Fortress");
			text = text.replace(/^NATBRAW$/g, "Natural Brawler");
			text = text.replace(/^NATCHARM$/g, "Natural Charmer");
			text = text.replace(/^NATDOC$/g, "Natural Doctor");
			text = text.replace(/^NATDRIV$/g, "Natural Driver");
			text = text.replace(/^NATENF$/g, "Natural Enforcer");
			text = text.replace(/^NATHUN$/g, "Natural Hunter");
			text = text.replace(/^NATLEAD$/g, "Natural Leader");
			text = text.replace(/^NATMAR$/g, "Natural Marksman");
			text = text.replace(/^NATNEG$/g, "Natural Negotiator");
			text = text.replace(/^NATOUT$/g, "Natural Outdoorsman");
			text = text.replace(/^NATPIL$/g, "Natural Pilot");
			text = text.replace(/^NATPRO$/g, "Natural Programmer");
			text = text.replace(/^NATROG$/g, "Natural Rogue");
			text = text.replace(/^NATSCH$/g, "Natural Scholar");
			text = text.replace(/^NATTIN$/g, "Natural Tinkerer");
			text = text.replace(/^NOBFOOL$/g, "Nobody's Fool");
			text = text.replace(/^OUTDOOR$/g, "Outdoorsman");
			text = text.replace(/^OVEREM$/g, "Overwhelm Emotions");
			text = text.replace(/^OVERDEF$/g, "Overwhelm Defenses");
			text = text.replace(/^PHYSTRAIN$/g, "Physical Training");
			text = text.replace(/^PLAUSDEN$/g, "Plausible Deniability");
			text = text.replace(/^POINTBL$/g, "Point Blank");
			text = text.replace(/^PWRBLST$/g, "Powerful Blast");
			text = text.replace(/^PRECAIM$/g, "Precise Aim");
			text = text.replace(/^PRESPNT$/g, "Pressure Point");
			text = text.replace(/^QUICKDR$/g, "Quick Draw");
			text = text.replace(/^QUICKFIX$/g, "Quick Fix");
			text = text.replace(/^QUICKST$/g, "Quick Strike");
			text = text.replace(/^RAPREA$/g, "Rapid Reaction");
			text = text.replace(/^RAPREC$/g, "Rapid Recovery");
			text = text.replace(/^REDUNSYS$/g, "Redundant Systems");
			text = text.replace(/^RESEARCH$/g, "Researcher");
			text = text.replace(/^RESOLVE$/g, "Resolve");
			text = text.replace(/^RESPSCHOL$/g, "Respected Scholar");
			text = text.replace(/^SCATH$/g, "Scathing Tirade");
			text = text.replace(/^SCATHIMP$/g, "Scathing Tirade (Improved)");
			text = text.replace(/^SCATHSUP$/g, "Scathing Tirade (Supreme)");
			text = text.replace(/^SECWIND$/g, "Second Wind");
			text = text.replace(/^SELDETON$/g, "Selective Detonation");
			text = text.replace(/^SENSDANG$/g, "Sense Danger");
			text = text.replace(/^SENSDEMO$/g, "Sense Emotions");
			text = text.replace(/^SHORTCUT$/g, "Shortcut");
			text = text.replace(/^SIDESTEP$/g, "Side Step");
			text = text.replace(/^SITAWARE$/g, "Situational Awareness");
			text = text.replace(/^SIXSENSE$/g, "Sixth Sense");
			text = text.replace(/^SKILLJOCK$/g, "Skilled Jockey");
			text = text.replace(/^SKILLSLIC$/g, "Skilled Slicer");
			text = text.replace(/^SLEIGHTMIND$/g, "Sleight of Mind");
			text = text.replace(/^SMOOTHTALK$/g, "Smooth Talker");
			text = text.replace(/^SNIPSHOT$/g, "Sniper Shot");
			text = text.replace(/^SOFTSP$/g, "Soft Spot");
			text = text.replace(/^SOLREP$/g, "Solid Repairs");
			text = text.replace(/^SOUNDINV$/g, "Sound Investments");
			text = text.replace(/^SPARECL$/g, "Spare Clip");
			text = text.replace(/^SPKBIN$/g, "Speaks Binary");
			text = text.replace(/^STALK$/g, "Stalker");
			text = text.replace(/^STNERV$/g, "Steely Nerves");
			text = text.replace(/^STIMAP$/g, "Stim Application");
			text = text.replace(/^STIMAPIMP$/g, "Stim Application (Improved)");
			text = text.replace(/^STIMAPSUP$/g, "Stim Application (Supreme)");
			text = text.replace(/^STIMSPEC$/g, "Stimpack Specialization");
			text = text.replace(/^STRSMART$/g, "Street Smarts");
			text = text.replace(/^STRGEN$/g, "Stroke of Genius");
			text = text.replace(/^STRONG$/g, "Strong Arm");
			text = text.replace(/^STUNBL$/g, "Stunning Blow");
			text = text.replace(/^STUNBLIMP$/g, "Stunning Blow (Improved)");
			text = text.replace(/^SUPREF$/g, "Superior Reflexes");
			text = text.replace(/^SURG$/g, "Surgeon");
			text = text.replace(/^SWIFT$/g, "Swift");
			text = text.replace(/^TACTTRAIN$/g, "Tactical Combat Training");
			text = text.replace(/^TARGBL$/g, "Targeted Blow");
			text = text.replace(/^TECHAPT$/g, "Technical Aptitude");
			text = text.replace(/^TIME2GO$/g, "Time to Go");
			text = text.replace(/^TIME2GOIMP$/g, "Time to Go (Improved)");
			text = text.replace(/^TINK$/g, "Tinkerer");
			text = text.replace(/^TOUCH$/g, "Touch of Fate");
			text = text.replace(/^TOUGH$/g, "Toughened");
			text = text.replace(/^TRICK$/g, "Tricky Target");
			text = text.replace(/^TRUEAIM$/g, "True Aim");
			text = text.replace(/^UNCANREAC$/g, "Uncanny Reactions");
			text = text.replace(/^UNCANSENS$/g, "Uncanny Senses");
			text = text.replace(/^UNSTOP$/g, "Unstoppable");
			text = text.replace(/^UTIL$/g, "Utility Belt");
			text = text.replace(/^UTINNI$/g, "Utinni!");
			text = text.replace(/^VEHTRAIN$/g, "Vehicle Combat Training");
			text = text.replace(/^WELLROUND$/g, "Well Rounded");
			text = text.replace(/^WELLTRAV$/g, "Well Traveled");
			text = text.replace(/^WHEEL$/g, "Wheel and Deal");
			text = text.replace(/^WORKLIKECHARM$/g, "Works Like A Charm");
			text = text.replace(/^PIN$/g, "Pin");
			text = text.replace(/^MUSEUMWORTHY$/g, "Museum Worthy");
			text = text.replace(/^BRNGITDWN$/g, "Bring It Down");
			text = text.replace(/^HUNTERQUARRY$/g, "Hunter's Quarry");
			text = text.replace(/^HUNTQIMP$/g, "Hunter's Quarry (Improved)");
			text = text.replace(/^BURLY$/g, "Burly");
			text = text.replace(/^FEARSOME$/g, "Fearsome");
			text = text.replace(/^HEAVYHITTER$/g, "Heavy Hitter");
			text = text.replace(/^HEROICRES$/g, "Heroic Resilience");
			text = text.replace(/^IMPDET$/g, "Improvised Detonation");
			text = text.replace(/^IMPDETIMP$/g, "Improvised Detonation (Improved)");
			text = text.replace(/^LOOM$/g, "Loom");
			text = text.replace(/^RAINDEATH$/g, "Rain of Death");
			text = text.replace(/^STEADYNERVES$/g, "Steady Nerves");
			text = text.replace(/^TALKTALK$/g, "Talk the Talk");
			text = text.replace(/^WALKWALK$/g, "Walk the Walk");
			text = text.replace(/^IDEALIST$/g, "Idealist");
			text = text.replace(/^AAO$/g, "Against All Odds");
			text = text.replace(/^ANIMALBOND$/g, "Animal Bond");
			text = text.replace(/^ANIMALBONDIMP$/g, "Animal Bond (Improved)");
			text = text.replace(/^ANIMALEMP$/g, "Animal Empathy");
			text = text.replace(/^ATARU$/g, "Ataru Technique");
			text = text.replace(/^BODIMP$/g, "Body Guard (Improved)");
			text = text.replace(/^BODSUP$/g, "Body Guard (Supreme)");
			text = text.replace(/^CALMAURA$/g, "Calming Aura");
			text = text.replace(/^CALMAURAIMP$/g, "Calming Aura (Improved)");
			text = text.replace(/^CENTBEING$/g, "Center of Being");
			text = text.replace(/^CENTBEINGIMP$/g, "Center of Being (Improved)");
			text = text.replace(/^CIRCLESHELTER$/g, "Circle of Shelter");
			text = text.replace(/^COMPTECH$/g, "Comprehend Technology");
			text = text.replace(/^CONDITIONED$/g, "Conditioned");
			text = text.replace(/^CONTPLAN$/g, "Contingency Plan");
			text = text.replace(/^COUNTERST$/g, "Counterstrike");
			text = text.replace(/^DEFCIRCLE$/g, "Defensive Circle");
			text = text.replace(/^DEFTRAIN$/g, "Defensive Training");
			text = text.replace(/^DISRUPSTRIKE$/g, "Disruptive Strike");
			text = text.replace(/^DJEMSODEFL$/g, "Djem So Deflection");
			text = text.replace(/^DRAWCLOSER$/g, "Draw Closer");
			text = text.replace(/^DUELTRAIN$/g, "Duelist's Training");
			text = text.replace(/^ENHLEAD$/g, "Enhanced Leader");
			text = text.replace(/^FALLAVAL$/g, "Falling Avalanche");
			text = text.replace(/^FEINT$/g, "Feint");
			text = text.replace(/^FORCEASSAULT$/g, "Force Assault");
			text = text.replace(/^FORCEPROT$/g, "Force Protection");
			text = text.replace(/^FOREWARN$/g, "Forewarning");
			text = text.replace(/^HAWKSWOOP$/g, "Hawk Bat Swoop");
			text = text.replace(/^HEALTRANCE$/g, "Healing Trance");
			text = text.replace(/^HEALTRANCEIMP$/g, "Healing Trance (Improved)");
			text = text.replace(/^IMBUEITEM$/g, "Imbue Item");
			text = text.replace(/^INTUITEVA$/g, "Intuitive Evasion");
			text = text.replace(/^INTUITIMP$/g, "Intuitive Improvements");
			text = text.replace(/^INTUITSHOT$/g, "Intuitive Shot");
			text = text.replace(/^INTUITSTRIKE$/g, "Intuitive Strike");
			text = text.replace(/^KEENEYED$/g, "Keen Eyed");
			text = text.replace(/^KNOWPOW$/g, "Knowledge is Power");
			text = text.replace(/^KNOWHEAL$/g, "Knowledgeable Healing");
			text = text.replace(/^MAKFIN$/g, "Makashi Finish");
			text = text.replace(/^MAKFLOUR$/g, "Makashi Flourish");
			text = text.replace(/^MAKTECH$/g, "Makashi Technique");
			text = text.replace(/^MASTART$/g, "Master Artisan");
			text = text.replace(/^MENTBOND$/g, "Mental Bond");
			text = text.replace(/^MENTTOOLS$/g, "Mental Tools");
			text = text.replace(/^MULTOPP$/g, "Multiple Opponents");
			text = text.replace(/^NATBLADE$/g, "Natural Blademaster");
			text = text.replace(/^NATMYSTIC$/g, "Natural Mystic");
			text = text.replace(/^NIMTECH$/g, "Niman Technique");
			text = text.replace(/^NOWYOUSEE$/g, "Now You See Me");
			text = text.replace(/^ONEUNI$/g, "One With The Universe");
			text = text.replace(/^PARRY$/g, "Parry");
			text = text.replace(/^PARRYIMP$/g, "Parry (Improved)");
			text = text.replace(/^PARRYSUP$/g, "Parry (Supreme)");
			text = text.replace(/^PHYSICIAN$/g, "Physician");
			text = text.replace(/^PREEMAVOID$/g, "Preemptive Avoidance");
			text = text.replace(/^PREYWEAK$/g, "Prey on the Weak");
			text = text.replace(/^QUICKMOVE$/g, "Quick Movement");
			text = text.replace(/^REFLECT$/g, "Reflect");
			text = text.replace(/^REFLECTIMP$/g, "Reflect (Improved)");
			text = text.replace(/^REFLECTSUP$/g, "Reflect (Supreme)");
			text = text.replace(/^RESDISARM$/g, "Resist Disarm");
			text = text.replace(/^SABERSW$/g, "Saber Swarm");
			text = text.replace(/^SABERTHROW$/g, "Saber Throw");
			text = text.replace(/^SARSWEEP$/g, "Sarlacc Sweep");
			text = text.replace(/^SENSEADV$/g, "Sense Advantage");
			text = text.replace(/^SHAREPAIN$/g, "Share Pain");
			text = text.replace(/^SHIENTECH$/g, "Shien Technique");
			text = text.replace(/^SHROUD$/g, "Shroud");
			text = text.replace(/^SLIPMIND$/g, "Slippery Minded");
			text = text.replace(/^SORESUTECH$/g, "Soresu Technique");
			text = text.replace(/^STRATFORM$/g, "Strategic Form");
			text = text.replace(/^SUMDJEM$/g, "Sum Djem");
			text = text.replace(/^TERRIFY$/g, "Terrify");
			text = text.replace(/^TERRIFYIMP$/g, "Terrify (Improved)");
			text = text.replace(/^FORCEALLY$/g, "The Force Is My Ally");
			text = text.replace(/^UNITYASSAULT$/g, "Unity Assault");
			text = text.replace(/^VALFACT$/g, "Valuable Facts");
			text = text.replace(/^BADCOP$/g, "Bad Cop");
			text = text.replace(/^BIGGESTFAN$/g, "Biggest Fan");
			text = text.replace(/^CONGENIAL$/g, "Congenial");
			text = text.replace(/^COORDODGE$/g, "Coordination Dodge");
			text = text.replace(/^DISBEH$/g, "Distracting Behavior");
			text = text.replace(/^DISBEHIMP$/g, "Distracting Behavior (Improved)");
			text = text.replace(/^DECEPTAUNT$/g, "Deceptive Taunt");
			text = text.replace(/^GOODCOP$/g, "Good Cop");
			text = text.replace(/^NATATHL$/g, "Natural Athlete");
			text = text.replace(/^NATMERCH$/g, "Natural Merchant");
			text = text.replace(/^THROWCRED$/g, "Throwing Credits");
			text = text.replace(/^UNRELSKEP$/g, "Unrelenting Skeptic");
			text = text.replace(/^UNRELSKEPIMP$/g, "Unrelenting Skeptic (Improved)");
			text = text.replace(/^BEASTWRANG$/g, "Beast Wrangler");
			text = text.replace(/^BOLSTARMOR$/g, "Bolstered Armor");
			text = text.replace(/^CORSEND$/g, "Corellian Sendoff");
			text = text.replace(/^CORSENDIMP$/g, "Corellian Sendoff (Improved)");
			text = text.replace(/^CUSTCOOL$/g, "Customized Cooling Unit");
			text = text.replace(/^EXHANDLER$/g, "Expert Handler");
			text = text.replace(/^FANCPAINT$/g, "Fancy Paint Job");
			text = text.replace(/^FORTVAC$/g, "Fortified Vacuum Seal");
			text = text.replace(/^HIGHGTRAIN$/g, "High-G Training");
			text = text.replace(/^KOITURN$/g, "Koiogran Turn");
			text = text.replace(/^LARGEPROJ$/g, "Larger Project");
			text = text.replace(/^NOTTODAY$/g, "Not Today");
			text = text.replace(/^OVERAMMO$/g, "Overstocked Ammo");
			text = text.replace(/^REINFRAME$/g, "Reinforced Frame");
			text = text.replace(/^SHOWBOAT$/g, "Showboat");
			text = text.replace(/^SIGVEH$/g, "Signature Vehicle");
			text = text.replace(/^SOOTHTONE$/g, "Soothing Tone");
			text = text.replace(/^SPUR$/g, "Spur");
			text = text.replace(/^SPURIMP$/g, "Spur (Improved)");
			text = text.replace(/^SPURSUP$/g, "Spur (Supreme)");
			text = text.replace(/^TUNEDTHRUST$/g, "Tuned Maneuvering Thrusters");
			text = text.replace(/^CALLEM$/g, "Call 'Em");
			text = text.replace(/^DISARMSMILE$/g, "Disarming Smile");
			text = text.replace(/^DONTSHOOT$/g, "Don't Shoot!");
			text = text.replace(/^DOUBLEORNOTHING$/g, "Double or Nothing");
			text = text.replace(/^DOUBLEORNOTHINGIMP$/g, "Double or Nothing (Improved)");
			text = text.replace(/^DOUBLEORNOTHINGSUP$/g, "Double or Nothing (Supreme)");
			text = text.replace(/^FORTFAVORBOLD$/g, "Fortune Favors the Bold");
			text = text.replace(/^GUNSBLAZING$/g, "Guns Blazing");
			text = text.replace(/^JUSTKID$/g, "Just Kidding!");
			text = text.replace(/^QUICKDRIMP$/g, "Quick Draw (Improved)");
			text = text.replace(/^SECCHANCE$/g, "Second Chances");
			text = text.replace(/^SORRYMESS$/g, "Sorry About the Mess");
			text = text.replace(/^SPITFIRE$/g, "Spitfire");
			text = text.replace(/^UPANTE$/g, "Up the Ante");
			text = text.replace(/^WORKLIKECHARM$/g, "Works Like a Charm");
			text = text.replace(/^BADPRESS$/g, "Bad Press");
			text = text.replace(/^BLACKMAIL$/g, "Blackmail");
			text = text.replace(/^CUTQUEST$/g, "Cutting Question");
			text = text.replace(/^DISCREDIT$/g, "Discredit");
			text = text.replace(/^ENCCOMM$/g, "Encoded Communique");
			text = text.replace(/^ENCWORD$/g, "Encouraging Words");
			text = text.replace(/^INKNOW$/g, "In The Know");
			text = text.replace(/^INKNOWIMP$/g, "In The Know (Improved)");
			text = text.replace(/^INFORM$/g, "Informant");
			text = text.replace(/^INTERJECT$/g, "Interjection");
			text = text.replace(/^KNOWALL$/g, "Know-It-All");
			text = text.replace(/^PLAUSDENIMP$/g, "Plausible Deniability (Improved)");
			text = text.replace(/^POSSPIN$/g, "Positive Spin");
			text = text.replace(/^POSSPINIMP$/g, "Positive Spin (Improved)");
			text = text.replace(/^RESEARCHIMP$/g, "Researcher (Improved)");
			text = text.replace(/^SUPPEVI$/g, "Supporting Evidence");
			text = text.replace(/^THORASS$/g, "Thorough Assessment");
			text = text.replace(/^TWISTWORD$/g, "Twisted Words");
			text = text.replace(/^DRIVEBACK$/g, "Drive Back");
			text = text.replace(/^ARMSUP$/g, "Armor Master (Supreme)");
			text = text.replace(/^BALEGAZE$/g, "Baleful Gaze");
			text = text.replace(/^BLINDSPOT$/g, "Blind Spot");
			text = text.replace(/^GRAPPLE$/g, "Grapple");
			text = text.replace(/^NOESC$/g, "No Escape");
			text = text.replace(/^OVERBAL$/g, "Overbalance");
			text = text.replace(/^PRECSTR$/g, "Precision Strike");
			text = text.replace(/^PRIMEPOS$/g, "Prime Positions");
			text = text.replace(/^PRESSHOT$/g, "Prescient Shot");
			text = text.replace(/^PROPAIM$/g, "Prophetic Aim");
			text = text.replace(/^REINITEM$/g, "Reinforce Item");
			text = text.replace(/^SUPPRFIRE$/g, "Suppressing Fire");
			text = text.replace(/^CALMCOMM$/g, "Calm Commander");
			text = text.replace(/^CLEVCOMM$/g, "Clever Commander");
			text = text.replace(/^COMMPRESIMP$/g, "Commanding Presence (Improved)");
			text = text.replace(/^CONFIMP$/g, "Confidence (Improved)");
			text = text.replace(/^MASINST$/g, "Master Instructor");
			text = text.replace(/^MASSTRAT$/g, "Master Strategist");
			text = text.replace(/^NATINST$/g, "Natural Instructor");
			text = text.replace(/^READANY$/g, "Ready for Anything");
			text = text.replace(/^READANYIMP$/g, "Ready for Anything (Improved)");
			text = text.replace(/^THATHOWDONE$/g, "That's How It's Done");
			text = text.replace(/^WELLREAD$/g, "Well Read");
			text = text.replace(/^CUSTLOAD$/g, "Custom Loadout");
			text = text.replace(/^CYBERNETICIST$/g, "Cyberneticist");
			text = text.replace(/^DEFTMAKER$/g, "Deft Maker");
			text = text.replace(/^ENGREDUN$/g, "Engineered Redundancies");
			text = text.replace(/^EYEDET$/g, "Eye for Detail");
			text = text.replace(/^ENERGTRANS$/g, "Energy Transfer");
			text = text.replace(/^MACHMEND$/g, "Machine Mender");
			text = text.replace(/^MOREMACH$/g, "More Machine Than Man");
			text = text.replace(/^OVERCHARGE$/g, "Overcharge");
			text = text.replace(/^OVERCHARGEIMP$/g, "Overcharge (Improved)");
			text = text.replace(/^OVERCHARGESUP$/g, "Supreme Overcharge");
			text = text.replace(/^REROUTEPROC$/g, "Reroute Processors");
			text = text.replace(/^RESOURCEREFIT$/g, "Resourceful Refit");
			text = text.replace(/^SPKBINIMP$/g, "Speaks Binary (Improved)");
			text = text.replace(/^SPKBINSUP$/g, "Speaks Binary (Supreme)");
			text = text.replace(/^DEATHBLOW$/g, "Deathblow");
			text = text.replace(/^ESSENKILL$/g, "Essential Kill");
			text = text.replace(/^FORCECONN$/g, "Force Connection");
			text = text.replace(/^HARASS$/g, "Harass");
			text = text.replace(/^HOLNAV$/g, "Holistic Navigation");
			text = text.replace(/^INTUITNAV$/g, "Intuitive Navigation");
			text = text.replace(/^MARKDEATH$/g, "Marked for Death");
			text = text.replace(/^MENACE$/g, "Menace");
			text = text.replace(/^MINDMAT$/g, "Mind Over Matter");
			text = text.replace(/^ONENAT$/g, "One with Nature");
			text = text.replace(/^PLANMAP$/g, "Planet Mapper");
			text = text.replace(/^SHORTCUTIMP$/g, "Shortcut (Improved)");
			text = text.replace(/^STUDPLOT$/g, "Studious Plotting");
			text = text.replace(/^SURVFIT$/g, "Survival of the Fittest");
			text = text.replace(/^TERRKILL$/g, "Terrifying Kill");
			text = text.replace(/^AMBUSH$/g, "Ambush");
			text = text.replace(/^CUNNSNARE$/g, "Cunning Snare");
			text = text.replace(/^MOVTARGET$/g, "Moving Target");
			text = text.replace(/^SEIZEINIT$/g, "Seize the Initiative");
			text = text.replace(/^MOUNTDOMEST$/g, "Domesticable");
			text = text.replace(/^MOUNTTRAINED$/g, "Trained Mount");
			text = text.replace(/^MOUNTBURDEN$/g, "Beast of Burden");
			text = text.replace(/^MOUNTSTUBBORN$/g, "Stubborn");
			text = text.replace(/^MOUNTDOMESTED$/g, "Domesticated");
			text = text.replace(/^MOUNTFLY$/g, "Flyer");
			text = text.replace(/^BETTERLUCK$/g, "Better Luck Next Time");
			text = text.replace(/^CONSTVIGIL$/g, "Constant Vigilance");
			text = text.replace(/^FEARSHAD$/g, "Fear the Shadows");
			text = text.replace(/^FREERUN$/g, "Freerunning");
			text = text.replace(/^FREERUNIMP$/g, "Freerunning (Improved)");
			text = text.replace(/^IMPOSFALL$/g, "Impossible Fall");
			text = text.replace(/^RECSCENE$/g, "Reconstruct the Scene");
			text = text.replace(/^SABERTHROWIMP$/g, "Saber Throw (Improved)");
			text = text.replace(/^SENSESCENE$/g, "Sense the Scene");
			text = text.replace(/^STRSMARTIMP$/g, "Street Smarts (Improved)");
			text = text.replace(/^SUPHUMAN$/g, "Superhuman Reflexes");
			text = text.replace(/^HARDBOILED$/g, "Hard-Boiled");
			text = text.replace(/^HINDERSHOT$/g, "Hindering Shot");
			text = text.replace(/^IRONBODY$/g, "Iron Body");
			text = text.replace(/^MARTIALGRACE$/g, "Martial Grace");
			text = text.replace(/^OFFDRIVE$/g, "Offensive Driving");
			text = text.replace(/^PRECSTRIMP$/g, "Precision Strike (Improved)");
			text = text.replace(/^PRECSTRSUP$/g, "Precision Strike (Supreme)");
			text = text.replace(/^UNARMPARRY$/g, "Unarmed Parry");
			text = text.replace(/^AGGRNEG$/g, "Aggressive Negotiations");
			text = text.replace(/^CRUCPOINT$/g, "Crucial Point");
			text = text.replace(/^EMPTYSOUL$/g, "Empty Soul");
			text = text.replace(/^GOWITHOUT$/g, "Go Without");
			text = text.replace(/^IRONSOUL$/g, "Iron Soul");
			text = text.replace(/^MEDTRANCE$/g, "Meditative Trance");
			text = text.replace(/^MINDBLEED$/g, "Mind Bleed");
			text = text.replace(/^NOWMAST$/g, "Now the Master");
			text = text.replace(/^ONCELEARN$/g, "Once A Learner");
			text = text.replace(/^SAVVYNEG$/g, "Savvy Negotiator");
			text = text.replace(/^SAVVYNEGIMP$/g, "Savvy Negotiator (Improved)");
			text = text.replace(/^SKILLEDTEACH$/g, "Skilled Teacher");
			text = text.replace(/^SUNDERIMP$/g, "Sunder (Improved)");
			text = text.replace(/^WISEWAR$/g, "Wise Warrior");
			text = text.replace(/^WISEWARIMP$/g, "Wise Warrior (Improved)");
			text = text.replace(/^COMBATPROG$/g, "Combat Programming");
			text = text.replace(/^CONSTSPEC$/g, "Construction Specialist");
			text = text.replace(/^CREATDES$/g, "Creative Design");
			text = text.replace(/^DESPREP$/g, "Desperate Repairs");
			text = text.replace(/^DESFLAW$/g, "Design Flaw");
			text = text.replace(/^DOCKEXP$/g, "Dockyard Expertise");
			text = text.replace(/^IMPDEF$/g, "Improvised Defenses");
			text = text.replace(/^IMPPOS$/g, "Improvised Position");
			text = text.replace(/^MASTDEMO$/g, "Master Demolitionist");
			text = text.replace(/^PUSHSPEC$/g, "Push the Specs");
			text = text.replace(/^REPPATCHSPEC$/g, "Repair Patch Specialization");
			text = text.replace(/^SMARTHAND$/g, "Smart Handling");
			text = text.replace(/^WEAKFOUND$/g, "Weak Foundation");
			text = text.replace(/^ALCARTS$/g, "Alchemical Arts");
			text = text.replace(/^CHANAG$/g, "Channel Agony");
			text = text.replace(/^FONTPOW$/g, "Font of Power");
			text = text.replace(/^IDING$/g, "Identify Ingredients");
			text = text.replace(/^IMPCONC$/g, "Improvised Concoction");
			text = text.replace(/^OVERWAURA$/g, "Overwhelming Aura");
			text = text.replace(/^OVERWAURAIMP$/g, "Overwhelming Aura (Improved)");
			text = text.replace(/^POWDARK$/g, "Power of Darkness");
			text = text.replace(/^SECRETLORE$/g, "Secret Lore");
			text = text.replace(/^TRANSMOG$/g, "Transmogrify");

            if (initText == text) {
                console.log('Please add base mod mapping for: ' + text);
            }
            return text;
        } else {
            return '';
        }
    }
});

App.filter('qualityFilter', function () {
    return function (text) {
        if (typeof text === 'string') {
            text = text.replace(/STUNSETTING/g, "Stun Setting");
            text = text.replace(/LIMITEDAMMO/g, "Limited Ammo");
            text = text.replace(/INFERIOR/g, "Inferior");
            text = text.replace(/INACCURATE/g, "Inaccurate");
            text = text.replace(/DEFLECTION/g, "Deflection"); // not sure
            text = text.replace(/ACCURATE/g, "Accurate");
            text = text.replace(/PIERCE/g, "Pierce");
            text = text.replace(/DISORIENT/g, "Disorient");
            text = text.replace(/SUPERIOR/g, "Superior");
            text = text.replace(/VICIOUSDROID/g, "Vicious Droid"); // not sure
            text = text.replace(/VICIOUS/g, "Vicious");
            text = text.replace(/AUTOFIRE/g, "Auto-Fire");
            text = text.replace(/LINKED/g, "Linked");
            text = text.replace(/CUMBERSOME/g, "Cumbersome");
            text = text.replace(/BLAST/g, "Blast");
            text = text.replace(/CONCUSSIVE/g, "Concussive");
            text = text.replace(/SLOWFIRING/g, "Slow-Firing");
            text = text.replace(/STUNDAMAGEDROID/g, "Stun Damage Droid"); // not sure
            text = text.replace(/STUNDAMAGE/g, "Stun Damage");
            text = text.replace(/PREPARE/g, "Prepare");
            text = text.replace(/UNWIELDY/g, "Unwieldy");
            text = text.replace(/BREACH/g, "Breach");
            text = text.replace(/BURN/g, "Burn");
            text = text.replace(/CORTOSIS/g, "Cortosis");
            text = text.replace(/DEFENSIVE/g, "Defensive");
            text = text.replace(/ENSNARE/g, "Ensnare");
            text = text.replace(/GUIDED/g, "Guided");
            text = text.replace(/ION/g, "Ion");
            text = text.replace(/KNOCKDOWN/g, "Knockdown");
            text = text.replace(/STUN/g, "Stun");
            text = text.replace(/SUNDER/g, "Sunder");
            text = text.replace(/TRACTOR/g, "Tractor");
            return text;
        } else {
            return '';
        }
    }
});

App.filter('tooltipFilter', function ($filter) {
    return function (text) {
        if (typeof text === 'string') {
            text = text.replace(/STUNSETTING/g, "Passive: Can switch weapon to Stun Damage");
            text = text.replace(/LIMITEDAMMO/g, "Passive: May be used to make a number of attacks equal to it's Limited Ammo rating before it must be reloaded.");
            text = text.replace(/INFERIOR/g, "Passive: Generates automatic [THREAT] on all checks.");
            text = text.replace(/INACCURATE/g, "Passive: Add [SETBACK] to the attacker's dice pool equal to their Inaccurate rating.");
            text = text.replace(/DEFLECTION/g, "Passive: Increases the ranged defense against ion attacks equal to its Deflect Ion rating");
            text = text.replace(/ACCURATE/g, "Passive: Add [SETBACK] to the attacker's dice pool equal to their Inaccurate rating.");
            text = text.replace(/PIERCE/g, "Passive: Ignores one point of Soak for each rank of Pierce");
            text = text.replace(/DISORIENT/g, "Active: The target is disoriented for a number of rounds equal to the weapon's Disorient rating.");
            text = text.replace(/SUPERIOR/g, "Passive: Generates automatic [ADVANTAGE] on all checks");
            text = text.replace(/VICIOUSDROID/g, "Passive: Add 10 times the Vicious rating to the critical roll against droids.");
            text = text.replace(/VICIOUS/g, "Passive: Add 10 times the Vicious rating to the critical roll.");
            text = text.replace(/AUTOFIRE/g, "Active: Increase the difficulty of the attack by [DIFFICULTY]. If the attack hits the attacker can trigger Auto-fire. Auto-fire can be triggered multiple times.Each time the attacker triggers Auto-fire it deals an additional hit to the target.");
            text = text.replace(/LINKED/g, "Active: On a successful attack the wielder may activate to gain an additional hit and may do so a number of times equal to the weapon's Linked rating.");
            text = text.replace(/CUMBERSOME/g, "Passive: The character needs a Brawn characteristic equal to or greater than the weapon's Cumbersome rating.");
            text = text.replace(/BLAST/g, "Active: If the attack is successful and Blast activates, each character (friend or foe) Engaged with the original target sufferes wounds equal to the weapon's Blast rating.");
            text = text.replace(/CONCUSSIVE/g, "Active: The target is staggered for a number of rounds equal to the weapon's Concussive rating.");
            text = text.replace(/SLOWFIRING/g, "Passive: Weapon must waith a number of rounds equal to its Slow-Firing rating before firing again.");
            text = text.replace(/STUNDAMAGEDROID/g, "Passive: Weapon deals damage as strain instead of wounds against droids.");
            text = text.replace(/STUNDAMAGE/g, "Passive: Weapon deals damage as strain instead of wounds.");
            text = text.replace(/PREPARE/g, "Passive: The user must perform a number of Prepare maneuvers equal to the weapon's Prepare rating before making attacks.");
            text = text.replace(/UNWIELDY/g, "Passive: To wield correctly, character needs Agility characteristic equal or greater than rating.");
            text = text.replace(/BREACH/g, "Passive: Ignore one point of Armor for every rank of Breach");
            text = text.replace(/BURN/g, "Active: If the attack is successful, the target continues to take the weapon's base damage for a number of rounds equal to the weapon's Burn rating.");
            text = text.replace(/CORTOSIS/g, "Passive: Weapons with the Cortosis quality are immune to the Sunder quality.");
            text = text.replace(/DEFENSIVE/g, "Passive: A character wielding a weapon with the Defensive quality increases his melee defense by the weapons's Defensive rating.");
            text = text.replace(/ENSNARE/g, "Active: The target is immobilized for a number of rounds equal to the weapon's Ensnare rating.");
            text = text.replace(/GUIDED/g, "Active: Weapon can make an attack check at the end of the round, the check's Ability dice are equal to the weapon's Guided rating.");
            text = text.replace(/ION/g, "Passive: Damage is dealt as System Strain (Vehicles) or Strain Threshold (Droids)");
            text = text.replace(/KNOCKDOWN/g, "Active: The target is knocked prone.");
            text = text.replace(/STUN/g, "Passive: Weapon causes Strain to the target");
            text = text.replace(/SUNDER/g, "Active: Damages opposing weapon one step.");
            text = text.replace(/TRACTOR/g, "Passive: Target may not move unless it makes a successful Piloting check with a difficulty based on the tractor beam's rating.");
            return text;
        } else {
            return '';
        }
    }
});

App.filter('min', function () {
    return function (items, search, attribute) {
        if (!search) {
            return items;
        }
        return items.filter(function (item) {
            return parseInt(item[attribute]) >= search;
        });
    };
});

App.filter('max', function () {
    return function (items, search, attribute) {
        if (!search) {
            return items;
        }
        return items.filter(function (item) {
            return parseInt(item[attribute]) <= search;
        });
    };
});

App.directive('errSrc', function () {
    return {
        link: function (scope, element, attrs) {
            element.bind('error', function () {
                if (attrs.src != attrs.errSrc) {
                    attrs.$set('src', attrs.errSrc);
                }
            });
        }
    }
});

App.directive('itemList', function () {
        return {
            templateUrl: 'app/components/items.html',
            scope: {
                sourceUrl: '@',
                isActive: '@',
                name: '@sourceName',
                keyDesc: '@keyDesc',
            },
            link: function (scope, elem, attrs) {
                scope.sideNavComponentId = 'sideNav-' + scope.name;
            },
            controller: function ($scope, $timeout, $mdSidenav, $http, $filter, $sce) {
                $scope.items = [];
                $scope.favourites = [];
                $scope.types = [];
                $scope.skills = [];
                $scope.sources = [];
                $scope.ranges = [];
                $scope.qualities = [];
                $scope.baseMods = [];
                $scope.addedMods = [];
                $scope.filteredItems = [];
                $scope.outputItems = [];
                $scope.min = {};
                $scope.max = {};
                $scope.filters = {};
                $scope.order = 'Name';                
                $scope.filterItems = function () {
                    $scope.promise = $timeout(function () {
                        if (typeof $scope.items != 'undefined') {
                            var filteredItems = $filter('searchFilter')($scope.items, $scope.filters.searchText);
                            filteredItems = $filter('min')(filteredItems, $scope.filters.minDamage, 'Damage');
                            filteredItems = $filter('max')(filteredItems, $scope.filters.maxDamage, 'Damage');
                            filteredItems = $filter('min')(filteredItems, $scope.filters.minSoak, 'Soak');
                            filteredItems = $filter('max')(filteredItems, $scope.filters.maxSoak, 'Soak');
                            filteredItems = $filter('min')(filteredItems, $scope.filters.minDefensive, 'Defensive');
                            filteredItems = $filter('max')(filteredItems, $scope.filters.maxDefensive, 'Defensive');
                            filteredItems = $filter('min')(filteredItems, $scope.filters.minDeflection, 'Deflection');
                            filteredItems = $filter('max')(filteredItems, $scope.filters.maxDeflection, 'Deflection');
                            filteredItems = $filter('min')(filteredItems, $scope.filters.minCrit, 'Crit');
                            filteredItems = $filter('max')(filteredItems, $scope.filters.maxCrit, 'Crit');
                            filteredItems = $filter('min')(filteredItems, $scope.filters.minRarity, 'Rarity');
                            filteredItems = $filter('max')(filteredItems, $scope.filters.maxRarity, 'Rarity');
                            filteredItems = $filter('min')(filteredItems, $scope.filters.minEncumbrance, 'Encumbrance');
                            filteredItems = $filter('max')(filteredItems, $scope.filters.maxEncumbrance, 'Encumbrance');
                            filteredItems = $filter('min')(filteredItems, $scope.filters.minHP, 'HP');
                            filteredItems = $filter('max')(filteredItems, $scope.filters.maxHP, 'HP');
                            filteredItems = $filter('min')(filteredItems, $scope.filters.minPrice, 'Price');
                            filteredItems = $filter('max')(filteredItems, $scope.filters.maxPrice, 'Price');
                            filteredItems = $filter('min')(filteredItems, $scope.filters.minWoundThreshold, 'WoundThreshold');
                            filteredItems = $filter('max')(filteredItems, $scope.filters.maxWoundThreshold, 'WoundThreshold');
                            filteredItems = $filter('min')(filteredItems, $scope.filters.minStrainThreshold, 'StrainThreshold');
                            filteredItems = $filter('max')(filteredItems, $scope.filters.maxStrainThreshold, 'StrainThreshold');
                            filteredItems = $filter('min')(filteredItems, $scope.filters.minExperience, 'Experience');
                            filteredItems = $filter('max')(filteredItems, $scope.filters.maxExperience, 'Experience');
                            filteredItems = $filter('min')(filteredItems, $scope.filters.minBrawn, 'Brawn');
                            filteredItems = $filter('max')(filteredItems, $scope.filters.maxBrawn, 'Brawn');
                            filteredItems = $filter('min')(filteredItems, $scope.filters.minAgility, 'Agility');
                            filteredItems = $filter('max')(filteredItems, $scope.filters.maxAgility, 'Agility');
                            filteredItems = $filter('min')(filteredItems, $scope.filters.minIntelligence, 'Intelligence');
                            filteredItems = $filter('max')(filteredItems, $scope.filters.maxIntelligence, 'Intelligence');
                            filteredItems = $filter('min')(filteredItems, $scope.filters.minCunning, 'Cunning');
                            filteredItems = $filter('max')(filteredItems, $scope.filters.maxCunning, 'Cunning');
                            filteredItems = $filter('min')(filteredItems, $scope.filters.minWillpower, 'Willpower');
                            filteredItems = $filter('max')(filteredItems, $scope.filters.maxWillpower, 'Willpower');
                            filteredItems = $filter('min')(filteredItems, $scope.filters.minPresence, 'Presence');
                            filteredItems = $filter('max')(filteredItems, $scope.filters.maxPresence, 'Presence');
                            filteredItems = $filter('fulltextFilter')(filteredItems, $scope.filters.type, 'Type');
                            filteredItems = $filter('fulltextFilter')(filteredItems, $scope.filters.skill, 'SkillKey');
                            filteredItems = $filter('fulltextFilter')(filteredItems, $scope.filters.range, 'RangeValue');
                            filteredItems = $filter('arrayFulltextFilter')(filteredItems, $scope.filters.baseMod, 'BaseMods', 'Key');
                            filteredItems = $filter('arrayFulltextFilter')(filteredItems, $scope.filters.addedMod, 'AddedMods', 'Key');
                            filteredItems = $filter('arrayFulltextFilter')(filteredItems, $scope.filters.quality, 'Qualities', 'Key');
                            filteredItems = $filter('arrayFulltextFilterOr')(filteredItems, $scope.filters.source, 'Sources', 'Book');
                            if ($scope.order.length > 0) {
                                filteredItems = $filter('orderBy')(filteredItems, $scope.order);
                            }
                            $scope.filteredItems = filteredItems;
                            if (filteredItems.length <= 20) {
                                $scope.outputItems = $scope.filteredItems;
                            } else {
                                $scope.outputItems = $filter('limitTo')($scope.filteredItems, 10);
                            }
                        }
                    });
                };
                $scope.resetFilters = function () {
                    $scope.filters = {
                        source: $scope.sources
                    };
                    $scope.filterItems();
                };
                $scope.increaseLimit = function () {
                    $scope.loading = true;
                    $timeout(function () {
                        var newItems = $filter('limitTo')($scope.filteredItems, 100, $scope.outputItems.length), l, i;
                        l = newItems.length;
                        for (i = 0; i < l; i++) {
                            $scope.outputItems.push(newItems[i]);
                        }
                        $scope.loading = false;
                    });
                };
                $scope.showAll = function () {
                    $scope.loading = true;
                    $timeout(function () {
                        var newItems = $filter('limitTo')($scope.filteredItems, $scope.filteredItems.length, $scope.outputItems.length), l, i;
                        l = newItems.length;
                        for (i = 0; i < l; i++) {
                            $scope.outputItems.push(newItems[i]);
                        }
                        $scope.loading = false;
                    });
                };
                $scope.fetchSource = function () {
                    $scope.loading = true;
                    $http.get($scope.sourceUrl).then(function (res) {
                        var i, l, i2, l2, items, qualities, baseMods, addedMods, talents, skills, abilities, sources, categoryLimits, outputItems = [];
                        items = res.data[$scope.name];
                        l = items.length;
                        $scope.min.Damage = $scope.getMinValue(items, 'Damage');
                        $scope.max.Damage = $scope.getMaxValue(items, 'Damage');
                        $scope.min.Soak = $scope.getMinValue(items, 'Soak');
                        $scope.max.Soak = $scope.getMaxValue(items, 'Soak');
                        $scope.min.Crit = $scope.getMinValue(items, 'Crit');
                        $scope.max.Crit = $scope.getMaxValue(items, 'Crit');
                        $scope.min.Rarity = $scope.getMinValue(items, 'Rarity');
                        $scope.max.Rarity = $scope.getMaxValue(items, 'Rarity');
                        $scope.min.Encumbrance = $scope.getMinValue(items, 'Encumbrance');
                        $scope.max.Encumbrance = $scope.getMaxValue(items, 'Encumbrance');
                        $scope.min.HP = $scope.getMinValue(items, 'HP');
                        $scope.max.HP = $scope.getMaxValue(items, 'HP');
                        $scope.min.Price = $scope.getMinValue(items, 'Price');
                        $scope.max.Price = $scope.getMaxValue(items, 'Price');
                        for (i = 0; i < l; i++) {
                            //if (items[i].Type == 'Vehicle') {
                            //    continue;
                            //}
                            qualities = [];
                            sources = [];
                            talents = [];
                            skills = [];
                            abilities = [];
                            baseMods = [];
                            addedMods = [];
                            categoryLimits = [];
                            itemLimits = [];
                            skillLimits = [];
                            typeLimits = [];
                            items[i].Deflection = 0;
                            
                            items[i].Info = $filter('infoFilter')(items[i]);
                            if (typeof items[i].Defense == 'number') {
                                items[i].Defensive = items[i].Defense;
                            } else {
                                items[i].Defensive = 0;
                            }
                            if (typeof items[i].Thumbnail == 'string') {
                                items[i].imageUrl = $sce.trustAsHtml(items[i].Thumbnail);
                            } else {
                                items[i].imageUrl = $sce.trustAsHtml('data/img/' + $scope.name + items[i].Key + '.png');
                            }
                            if (typeof items[i].Description == 'string') {
                                items[i].Description = $filter('descriptionFilter')(items[i]);
                            }
                            if (typeof items[i].Name == 'string') {
                                items[i].Name = $filter('nameFilter')(items[i]);
                            }
                            if (typeof items[i].Damage == 'undefined') {
                                items[i].Damage = 0;
                            }
                            if (typeof items[i].DamageAdd == 'undefined') {
                                items[i].DamageAdd = 0;
                            }
                            if (typeof items[i].HP == 'undefined') {
                                items[i].HP = 0;
                            }
                            if (typeof items[i].Qualities == 'object') {
                                if (typeof items[i].Qualities.Quality == 'object') {
                                    if (typeof items[i].Qualities.Quality.Key == 'string') {
                                        items[i].Qualities.Quality.Tooltip = $filter('tooltipFilter')(items[i].Qualities.Quality.Key);
                                        items[i].Qualities.Quality.Key = $filter('qualityFilter')(items[i].Qualities.Quality.Key);
                                        if (items[i].Qualities.Quality.Key == 'Defensive') {
                                            items[i].Defensive = items[i].Qualities.Quality.Count;
                                        }
                                        if (items[i].Qualities.Quality.Key == 'Deflection') {
                                            items[i].Deflection = items[i].Qualities.Quality.Count;
                                        }
                                        qualities.push(items[i].Qualities.Quality);
                                    } else {
                                        if (typeof items[i].Qualities.Quality.length == 'number') {
                                            l2 = items[i].Qualities.Quality.length;
                                            for (i2 = 0; i2 < l2; i2++) {
                                                items[i].Qualities.Quality[i2].Tooltip = $filter('tooltipFilter')(items[i].Qualities.Quality[i2].Key);
                                                items[i].Qualities.Quality[i2].Key = $filter('qualityFilter')(items[i].Qualities.Quality[i2].Key);
                                                if (items[i].Qualities.Quality[i2].Key == 'Defensive') {
                                                    items[i].Defensive = items[i].Qualities.Quality[i2].Count;
                                                }
                                                if (items[i].Qualities.Quality[i2].Key == 'Deflection') {
                                                    items[i].Deflection = items[i].Qualities.Quality[i2].Count;
                                                }
                                                qualities.push(items[i].Qualities.Quality[i2]);
                                            }
                                        }
                                    }
                                }
                            }
                            if (typeof items[i].Quality == 'string') {
                                if (typeof items[i].Quality.Key == 'string') {
                                    items[i].Quality.Key = $filter('qualityFilter')(items[i].Quality.Key);
                                    if (items[i].Quality.Key == 'Defensive') {
                                        items[i].Defensive = items[i].Quality.Count;
                                    }
                                    if (items[i].Quality.Key == 'Deflection') {
                                        items[i].Deflection = items[i].Quality.Count;
                                    }
                                    qualities.push(items[i].Quality);
                                }
                            }
                            items[i].Qualities = qualities;
                            if (typeof items[i].Sources != 'undefined' && typeof items[i].Sources.Source != 'undefined') {
                                for (var i4 = 0, l4 = items[i].Sources.Source.length; i4 < l4; i4++) {
                                    if (typeof items[i].Sources.Source[i4].Book == 'string') {
                                        sources.push(items[i].Sources.Source[i4]);
                                    }
                                    if (typeof items[i].Sources.Source == 'object' && typeof items[i].Sources.Source[i4] == 'string') {
                                        sources.push({'Book': items[i].Sources.Source[i4]});
                                    }
                                    
                                }
                                if (typeof items[i].Sources.Source == 'string') {
                                    sources.push({'Book': items[i].Sources.Source});
                                }
                                if (typeof items[i].Sources.Source == 'object' && typeof items[i].Sources.Source.Book == 'string') {
                                    if (typeof items[i].Sources.Source.Page == 'number' || typeof items[i].Sources.Source.Page == 'string') {
                                        sources.push({'Book': items[i].Sources.Source.Book, 'Page' : items[i].Sources.Source.Page});
                                    } else {
                                    	sources.push({'Book': items[i].Sources.Source.Book});
                                    }
                                }                                
                            }
                            if (typeof items[i].Source == 'object' && typeof items[i].Source.Book == 'string') {
                                sources.push(items[i].Source);
                                delete items[i].Source;
                            }
                            if (typeof items[i].Source == 'string') {
                                sources.push({'Book': items[i].Source});
                                delete items[i].Source;
                            }                            
                            if (sources.length == 0) {
                                sources.push({'Book': 'Missing'});
                            }
                            items[i].Sources = sources;
                            
                            
                            if (typeof items[i].BaseMods == 'object') {
                                if (typeof items[i].BaseMods.Mod == 'object' && items[i].BaseMods.Mod.length > 0) {
                                    for (var i3 = 0, l3 = items[i].BaseMods.Mod.length; i3 < l3; i3++) {
                                        if (typeof items[i].BaseMods.Mod[i3].Key == 'string') {
                                            items[i].BaseMods.Mod[i3].Key = $filter('modFilter')(items[i].BaseMods.Mod[i3].Key);
                                            baseMods.push(items[i].BaseMods.Mod[i3]);
                                        }
                                    }
                                } else {
                                    if (typeof items[i].BaseMods.Mod != 'undefined') {
                                        if (typeof items[i].BaseMods.Mod.Key == 'string') {
                                            items[i].BaseMods.Mod.Key = $filter('modFilter')(items[i].BaseMods.Mod.Key);
                                            baseMods.push(items[i].BaseMods.Mod);
                                        }
                                    }
                                }
                            }
                            items[i].BaseMods = baseMods;
                            if (typeof items[i].AddedMods == 'object') {
                                if (typeof items[i].AddedMods.Mod == 'object' && items[i].AddedMods.Mod.length > 0) {
                                    for (i3 = 0, l3 = items[i].AddedMods.Mod.length; i3 < l3; i3++) {
                                        if (typeof items[i].AddedMods.Mod[i3].Key == 'string') {
                                            items[i].AddedMods.Mod[i3].Key = $filter('modFilter')(items[i].AddedMods.Mod[i3].Key);
                                            addedMods.push(items[i].AddedMods.Mod[i3]);
                                        }
                                    }
                                } else {
                                    if (typeof items[i].AddedMods.Mod != 'undefined') {
                                        if (typeof items[i].AddedMods.Mod.Key == 'string') {
                                            items[i].AddedMods.Mod.Key = $filter('modFilter')(items[i].AddedMods.Mod.Key);
                                            addedMods.push(items[i].AddedMods.Mod);
                                        }
                                    }
                                }
                            }
                            items[i].AddedMods = addedMods;
                            if (typeof items[i].SkillKey == 'string') {
                                items[i].SkillKey = $filter('skillFilter')(items[i].SkillKey);
                                if (items[i].SkillKey == 'Melee' || items[i].SkillKey == 'Lightsaber' || items[i].SkillKey == 'Brawl' || items[i].Type == 'Thrown') {
                                    if (items[i].DamageAdd > 0 && items[i].Damage == 0) {
                                        items[i].Damage = items[i].DamageAdd;
                                    }
                                }
                            }
                            if (typeof items[i].RangeValue == 'string') {
                                items[i].RangeValue = $filter('rangeFilter')(items[i].RangeValue);
                            }
                            if (typeof items[i].Characteristics == 'object') {
                                if (typeof items[i].Characteristics.Characteristic == 'object') {
                                    if (typeof items[i].Characteristics.Characteristic.length == 'number') {
                                        l2 = items[i].Characteristics.Characteristic.length;
                                        for (i2 = 0; i2 < l2; i2++) {
                                            if (items[i].Characteristics.Characteristic[i2].Key == 'BR') {
                                                items[i].Brawn = items[i].Characteristics.Characteristic[i2].Rank;
                                            }
                                            if (items[i].Characteristics.Characteristic[i2].Key == 'AG') {
                                                items[i].Agility = items[i].Characteristics.Characteristic[i2].Rank;
                                            }
                                            if (items[i].Characteristics.Characteristic[i2].Key == 'INT') {
                                                items[i].Intelligence = items[i].Characteristics.Characteristic[i2].Rank;
                                            }
                                            if (items[i].Characteristics.Characteristic[i2].Key == 'CUN') {
                                                items[i].Cunning = items[i].Characteristics.Characteristic[i2].Rank;
                                            }
                                            if (items[i].Characteristics.Characteristic[i2].Key == 'WIL') {
                                                items[i].Willpower = items[i].Characteristics.Characteristic[i2].Rank;
                                            }
                                            if (items[i].Characteristics.Characteristic[i2].Key == 'PR') {
                                                items[i].Presence = items[i].Characteristics.Characteristic[i2].Rank;
                                            }
                                        }
                                    }
                                }
                                if (items[i].Characteristics.Brawn) {
                                    items[i].Brawn = items[i].Characteristics.Brawn;
                                }
                                if (items[i].Characteristics.Agility) {
                                    items[i].Agility = items[i].Characteristics.Agility;
                                }
                                if (items[i].Characteristics.Intellect) {
                                    items[i].Intelligence = items[i].Characteristics.Intellect;
                                }
                                if (items[i].Characteristics.Cunning) {
                                    items[i].Cunning = items[i].Characteristics.Cunning;
                                }
                                if (items[i].Characteristics.Willpower) {
                                    items[i].Willpower = items[i].Characteristics.Willpower;
                                }
                                if (items[i].Characteristics.Presence) {
                                    items[i].Presence = items[i].Characteristics.Presence;
                                }
                            }
                            if (typeof items[i].Talents == 'object') {
                                if (typeof items[i].Talents.Talent == 'object') {
                                    if (typeof items[i].Talents.Talent.Name == 'string') {
                                        if (typeof items[i].Talents.Talent.Rank == 'undefined') {
                                            items[i].Talents.Talent.Rank = 1;
                                        }
                                        talents.push(items[i].Talents.Talent);
                                    } else {
                                        if (typeof items[i].Talents.Talent.length == 'number') {
                                            l2 = items[i].Talents.Talent.length;
                                            for (i2 = 0; i2 < l2; i2++) {
                                                if (typeof items[i].Talents.Talent[i2].Rank == 'undefined') {
                                                    items[i].Talents.Talent[i2].Rank = 1;
                                                }
                                                talents.push(items[i].Talents.Talent[i2]);
                                            }
                                        }
                                    }
                                }
                            }
                            items[i].Talents = talents;
                            if (typeof items[i].Skills == 'object') {
                                if (typeof items[i].Skills.Skill == 'object') {
                                    if (typeof items[i].Skills.Skill.Name == 'string') {
                                        if (typeof items[i].Skills.Skill.Rank == 'undefined') {
                                            items[i].Skills.Skill.Rank = 1;
                                        }
                                        skills.push(items[i].Skills.Skill);
                                    } else {
                                        if (typeof items[i].Skills.Skill.length == 'number') {
                                            l2 = items[i].Skills.Skill.length;
                                            for (i2 = 0; i2 < l2; i2++) {
                                                if (typeof items[i].Skills.Skill[i2].Rank == 'undefined') {
                                                    items[i].Skills.Skill[i2].Rank = 1;
                                                }
                                                skills.push(items[i].Skills.Skill[i2]);
                                            }
                                        }
                                    }
                                }
                            }
                            items[i].Skills = skills;
                            if (typeof items[i].Abilities == 'object') {
                                if (typeof items[i].Abilities.Ability == 'object') {
                                    if (typeof items[i].Abilities.Ability.Name == 'string') {
                                        abilities.push(items[i].Abilities.Ability);
                                    } else {
                                        if (typeof items[i].Abilities.Ability.length == 'number') {
                                            l2 = items[i].Abilities.Ability.length;
                                            for (i2 = 0; i2 < l2; i2++) {
                                                abilities.push(items[i].Abilities.Ability[i2]);
                                            }
                                        }
                                    }
                                }
                            }
                            items[i].Abilities = abilities;
                            if (typeof items[i].SpecialAbilities == 'object') {
                                if (typeof items[i].SpecialAbilities.SpecialAbility == 'object') {
                                    if (typeof items[i].SpecialAbilities.SpecialAbility.Description == 'string') {
                                        items[i].SpecialAbilities.SpecialAbility = [
                                            {
                                                Name: items[i].SpecialAbilities.SpecialAbility.Name,
                                                Description: $sce.trustAsHtml($filter('symbolFilter')(items[i].SpecialAbilities.SpecialAbility.Description))
                                            }
                                        ]
                                    } else {
                                        if (typeof items[i].SpecialAbilities.SpecialAbility.length == 'number') {
                                            l2 = items[i].SpecialAbilities.SpecialAbility.length;
                                            for (i2 = 0; i2 < l2; i2++) {
                                                items[i].SpecialAbilities.SpecialAbility[i2].Description = $sce.trustAsHtml($filter('symbolFilter')(items[i].SpecialAbilities.SpecialAbility[i2].Description));
                                            }
                                        }
                                    }
                                }
                            }
                            if (typeof items[i].Attributes != 'undefined') {
                                if (typeof items[i].Attributes.Soak == 'number') {
                                    items[i].Soak = items[i].Attributes.Soak;
                                }
                                if (typeof items[i].Attributes.WoundThreshold == 'number') {
                                    items[i].WoundThreshold = items[i].Attributes.WoundThreshold;
                                }
                                if (typeof items[i].Attributes.WoundThreshold == 'number') {
                                    items[i].StrainThreshold = items[i].Attributes.StrainThreshold;
                                }
                                if (typeof items[i].Attributes.Experience == 'number') {
                                    items[i].Experience = items[i].Attributes.Experience;
                                }
                                if (typeof items[i].Attributes.ForceRating == 'number') {
                                    items[i].ForceRating = items[i].Attributes.ForceRating;
                                }
                            }
                            if (typeof items[i].CategoryLimit == 'object') {
                                if (typeof items[i].CategoryLimit.Category == 'string') {
                                    categoryLimits.push(items[i].CategoryLimit.Category);
                                }
                                if (typeof items[i].CategoryLimit.Category == 'object') {
                                    if (typeof items[i].CategoryLimit.Category.length == 'number') {
                                        l2 = items[i].CategoryLimit.Category.length;
                                        for (i2 = 0; i2 < l2; i2++) {
                                            categoryLimits.push(items[i].CategoryLimit.Category[i2]);
                                        }
                                    }
                                }
                            }
                            items[i].CategoryLimit = categoryLimits;
                            if (typeof items[i].ItemLimit == 'object') {
                                if (typeof items[i].ItemLimit.Item == 'string') {
                                    itemLimits.push(items[i].ItemLimit.Item);
                                }
                                if (typeof items[i].ItemLimit.Item == 'object') {
                                    if (typeof items[i].ItemLimit.Item.length == 'number') {
                                        l2 = items[i].ItemLimit.Item.length;
                                        for (i2 = 0; i2 < l2; i2++) {
                                            itemLimits.push(items[i].ItemLimit.Item[i2]);
                                        }
                                    }
                                }
                            }
                            items[i].ItemLimit = itemLimits;
                            if (typeof items[i].TypeLimit == 'object') {
                                if (typeof items[i].TypeLimit.Type == 'string') {
                                    typeLimits.push(items[i].TypeLimit.Type);
                                }
                                if (typeof items[i].TypeLimit.Type == 'object') {
                                    if (typeof items[i].TypeLimit.Type.length == 'number') {
                                        l2 = items[i].TypeLimit.Type.length;
                                        for (i2 = 0; i2 < l2; i2++) {
                                            typeLimits.push(items[i].TypeLimit.Type[i2]);
                                        }
                                    }
                                }
                            }
                            items[i].TypeLimit = typeLimits;
                            if (typeof items[i].SkillLimit == 'object') {
                                if (typeof items[i].SkillLimit.Skill == 'string') {
                                    skillLimits.push(items[i].SkillLimit.Skill);
                                }
                                if (typeof items[i].SkillLimit.Skill == 'object') {
                                    if (typeof items[i].SkillLimit.Skill.length == 'number') {
                                        l2 = items[i].SkillLimit.Skill.length;
                                        for (i2 = 0; i2 < l2; i2++) {
                                            skillLimits.push(items[i].SkillLimit.Skill[i2]);
                                        }
                                    }
                                }
                            }
                            items[i].SkillLimit = skillLimits;
                            $scope.collectValues(items[i].Qualities, 'Key', $scope.qualities);
                            $scope.collectValues(items[i].BaseMods, 'Key', $scope.baseMods);
                            $scope.collectValues(items[i].AddedMods, 'Key', $scope.addedMods);
                            $scope.collectValues(items[i].Sources, 'Book', $scope.sources);
                            outputItems.push(items[i]);
                        }
                        $scope.min.Defensive = $scope.getMinValue(items, 'Defensive');
                        $scope.max.Defensive = $scope.getMaxValue(items, 'Defensive');
                        $scope.min.Deflection = $scope.getMinValue(items, 'Deflection');
                        $scope.max.Deflection = $scope.getMaxValue(items, 'Deflection');
                        $scope.collectValues(outputItems, 'SkillKey', $scope.skills);
                        $scope.collectValues(outputItems, 'Type', $scope.types);
                        $scope.collectValues(outputItems, 'RangeValue', $scope.ranges);
                        $scope.min.WoundThreshold = $scope.getMinValue(items, 'WoundThreshold');
                        $scope.max.WoundThreshold = $scope.getMaxValue(items, 'WoundThreshold');
                        $scope.min.StrainThreshold = $scope.getMinValue(items, 'StrainThreshold');
                        $scope.max.StrainThreshold = $scope.getMaxValue(items, 'StrainThreshold');
                        $scope.min.Experience = $scope.getMinValue(items, 'Experience');
                        $scope.max.Experience = $scope.getMaxValue(items, 'Experience');
                        $scope.min.Brawn = $scope.getMinValue(items, 'Brawn');
                        $scope.max.Brawn = $scope.getMaxValue(items, 'Brawn');
                        $scope.min.Agility = $scope.getMinValue(items, 'Agility');
                        $scope.max.Agility = $scope.getMaxValue(items, 'Agility');
                        $scope.min.Intelligence = $scope.getMinValue(items, 'Intelligence');
                        $scope.max.Intelligence = $scope.getMaxValue(items, 'Intelligence');
                        $scope.min.Cunning = $scope.getMinValue(items, 'Cunning');
                        $scope.max.Cunning = $scope.getMaxValue(items, 'Cunning');
                        $scope.min.Willpower = $scope.getMinValue(items, 'Willpower');
                        $scope.max.Willpower = $scope.getMaxValue(items, 'Willpower');
                        $scope.min.Presence = $scope.getMinValue(items, 'Presence');
                        $scope.max.Presence = $scope.getMaxValue(items, 'Presence');
                        $scope.items = outputItems;
                        $scope.filters.source = $scope.sources;
                        $scope.filterItems();
                        $scope.loading = false;
                    });
                   
                };
                $scope.collectValues = function (items, attribute, values) {
                    var value, i, l = items.length;
                    for (i = 0; i < l; i++) {
                        if (typeof items[i][attribute] === 'string') {
                            value = items[i][attribute];
                            if (values.indexOf(value, 0) === -1) {
                                values.push(value);
                            }
                        }
                    }
                    values.sort();
                };
                $scope.getMinValue = function (items, attribute) {
                    var value, min, i, l = items.length;
                    for (i = 0; i < l; i++) {
                        if (typeof items[i][attribute] === 'number') {
                            value = items[i][attribute];
                            if (typeof min == 'undefined' || value < min) {
                                min = value;
                            }
                        }
                    }
                    return min;
                };
                $scope.getMaxValue = function (items, attribute) {
                    var value, max, i, l = items.length;
                    for (i = 0; i < l; i++) {
                        if (typeof items[i][attribute] === 'number') {
                            value = items[i][attribute];
                            if (typeof max == 'undefined' || value > max) {
                                max = value;
                            }
                        }
                    }
                    return max;
                };
                $scope.getMinValue = function (items, attribute) {
                    var value, min, i, l = items.length;
                    for (i = 0; i < l; i++) {
                        if (typeof items[i][attribute] === 'number') {
                            value = items[i][attribute];
                            if (typeof min == 'undefined' || value < min) {
                                min = value;
                            }
                        }
                    }
                    return min;
                };
                $scope.toggleSideNav = function () {
                    $mdSidenav($scope.sideNavComponentId).toggle();
                };
                $scope.$watch('isActive', function () {
                    if ($scope.isActive == "true" && $scope.items.length == 0) {
                        $scope.fetchSource();
                    }
                })
            }
        }
    }
);