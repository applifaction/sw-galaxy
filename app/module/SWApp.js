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

App.filter('descriptionFilter', function ($sce, $filter) {
    return function (item) {
        var html = '', mods = '', count;
        if (typeof item.Name == 'string') {
            html += "<div><strong>" + item.Name + "</strong></div>";
        }
        if (typeof item.Description == 'string') {
            html += "<p>" + item.Description + "</p>";
        }
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
            text = text.replace(/^JURYADD$/g, "May select 1 additional Jury Rigged option");
            text = text.replace(/^NOSTUN$/g, "Cannot deal strain damage");
            text = text.replace(/^BREACH$/g, "Grant Quality (Breach 1)");
            text = text.replace(/^DAMSUB$/g, "Damage -1");
            text = text.replace(/^DAMADD$/g, "Damage +1");
            text = text.replace(/^VIGIL$/g, "Skill (Vigilance)");
            text = text.replace(/^PERC$/g, "Skill (Perception)");
            text = text.replace(/^BRAWL$/g, "Skill (Brawl)");
            text = text.replace(/^BR$/g, "Characteristic (Brawn)");
            text = text.replace(/^ATHL$/g, "Skill (Athletics)");
            text = text.replace(/^RESIL$/g, "Skill (Resilience)");
            text = text.replace(/^DEFSTA$/g, "Innate Talent (Defensive Stance)");
            text = text.replace(/^RAPREC$/g, "Innate Talent (Rapid Recovery)");
            text = text.replace(/^DEMONMASK$/g, "Increase wound threshold by 2 if dark side Force user");
            text = text.replace(/^IRONFIST$/g, "Armor and Brawl attacks gain Cortosis quality. Brawl attacks gain Pierce ranks equal to Force rating");
            text = text.replace(/^FORCEADD$/g, "Add 1 to Force Rating");
            text = text.replace(/^RANGLT$/g, "Skill (Ranged - Light as Career Skill)");
            text = text.replace(/^MECH$/g, "Skill (Mechanics as Career Skill)");
            text = text.replace(/^SLEIGHTMIND$/g, "Innate Talent (Sleight of Mind)");
            text = text.replace(/^ASTRO$/g, "Skill (Astrogation as Career Skill)");
            text = text.replace(/^GUNN$/g, "Skill (Gunnery as Career Skill)");
            text = text.replace(/^LORE$/g, "Skill (Lore as Career Skill)");
            text = text.replace(/^LTSABER$/g, "Skill (Lightsaber as Career Skill)");
            text = text.replace(/^OUT$/g, "Skill (Outer Rim as Career Skill)");
            text = text.replace(/^SW$/g, "Skill (Streetwise as Career Skill)");
            text = text.replace(/^COMP$/g, "Skill (Computers as Career Skill)");
            text = text.replace(/^DISC$/g, "Skill (Discipline as Career Skill)");
            text = text.replace(/^MED$/g, "Skill (Medicine as Career Skill)");
            text = text.replace(/^COOL$/g, "Skill (Cool as Career Skill)");
            text = text.replace(/^COORD$/g, "Skill (Coordination as Career Skill)");
            text = text.replace(/^SKUL$/g, "Skill (Skulduggery as Career Skill)");
            text = text.replace(/^XEN$/g, "Skill (Xenology as Career Skill)");
            text = text.replace(/^SURV$/g, "Skill (Survival as Career Skill)");
            text = text.replace(/^NATMAR$/g, "Innate Talent (Natural Marksman)");
            text = text.replace(/^SETBACKADD$/g, "Add [SETBACK]");
            text = text.replace(/^BOOSTADD$/g, "Add [BOOST]");
            text = text.replace(/^SOAKADD$/g, "Implant Armor");
            text = text.replace(/^PILOTSP$/g, "Skill (Piloting - Space as Career Skill)");
            text = text.replace(/^CYBERADD$/g, "Add 1 to Cybernetics Cap");
            text = text.replace(/^CYBERNONE$/g, "Does not count toward Cybernetics Cap");
            text = text.replace(/^ENCTADD$/g, "Increase Encumbrance Threshold by 1");
            text = text.replace(/^CUMBERSOME$/g, "Quality (Cumbersome 1)");
            text = text.replace(/^MEDFOCUS$/g, "Increase strain threshold by 2 if light side paragon");
            text = text.replace(/^MOVEBASIC$/g, "Innate Force Ability (Move Basic Power Force Ability)");
            text = text.replace(/^RAPREA$/g, "Innate Talent (Rapid Reaction)");
            text = text.replace(/^HIDD$/g, "Innate Talent (Hidden Storage)");
            text = text.replace(/^BLO$/g, "Innate Talent (Blooded)");
            text = text.replace(/^BYP$/g, "Innate Talent (Bypass Security)");
            text = text.replace(/^AG$/g, "Characteristic (Agility)");
            text = text.replace(/^INTIM$/g, "Innate Talent (Intimidating)");
            text = text.replace(/^INT$/g, "Characteristic (Intellect)");
            text = text.replace(/^STRAINADD$/g, "Increases user's strain by 1");
            text = text.replace(/^CORTOSIS$/g, "Quality (Cortosis)");
            text = text.replace(/^ENCADD$/g, "Increase Encumbrance by 1");
            text = text.replace(/^INACCURATE$/g, "Quality (Inaccurate 1)");
            text = text.replace(/^ACCURATE$/g, "Quality (Accurate 1)");
            text = text.replace(/^PIERCE$/g, "Quality (Pierce 1)");
            text = text.replace(/^RANGEADD$/g, "Increases weapon's range by 1 Range Band(s)");
            text = text.replace(/^SUBQUALINACCURATE$/g, "Decrease the Inaccurate Quality by 1");
            text = text.replace(/^ENCSUB$/g, "Decrease Encumbrance by 1");
            text = text.replace(/^AUTOFIRE$/g, "Quality (Auto Fire)");
            text = text.replace(/^QUICKDR$/g, "Innate Talent (Quick Draw)");
            text = text.replace(/^SNIPSHOT$/g, "Innate Talent (Sniper Shot)");
            text = text.replace(/^DAMSET$/g, "Changes Base Damage");
            text = text.replace(/^CRITSET$/g, "Changes Base Critical Rating");
            text = text.replace(/^SUNDER$/g, "Quality (Sunder)");
            text = text.replace(/^CRITSUB$/g, "Decreases Critical by 1");
            text = text.replace(/^VICIOUS$/g, "Quality (Vicious 1)");
            text = text.replace(/^LIMITEDAMMO$/g, "Quality (Limited Ammo 1)");
            text = text.replace(/^SETBACKSUB$/g, "Remove [SE] from all attack checks when using this weapon");
            text = text.replace(/^BURN$/g, "Grant Quality (Burn 1)");
            text = text.replace(/^BLAST$/g, "Replace Quality (Blast [Weapon Damage times one half])");
            text = text.replace(/^RANGESUB$/g, "Decreases weapon's range by 1 Range Band");
            text = text.replace(/^DISORIENT$/g, "Quality (Disorient 1)");
            text = text.replace(/^DEFENSIVE$/g, "Quality (Defensive 1)");
            text = text.replace(/^ADDCRYSTNC$/g, "Add 1 Additional Crystal with no HP Cost");
            text = text.replace(/^CONCUSSIVE$/g, "Quality (Concussive 1)");
            text = text.replace(/^CARRY1$/g, "Carry 1 Item up to Encumbrance 1");
            text = text.replace(/^ADVADD$/g, "Add [AD] to Successful Check");
            text = text.replace(/^POINTBL$/g, "Innate Talent (Point Blank)");
            text = text.replace(/^DURA$/g, "Innate Talent (Durable)");
            text = text.replace(/^ENCTBRADD$/g, "Increase Brawn for Determining Encumbrance Threshold by 1");
            text = text.replace(/^GUIDED$/g, "Grant Quality (Guided 2)");
            text = text.replace(/^REMQUALION$/g, "Removes the Ion Quality");
            text = text.replace(/^STUN$/g, "Quality (Stun 1)");
            text = text.replace(/^HEALPLUSONE$/g, "Successful Medicine checks heal +1 wound");
            text = text.replace(/^PRECAIM$/g, "Innate Talent (Precise Aim)");
            text = text.replace(/^PARRY$/g, "Innate Talent (Parry)");
            text = text.replace(/^BRA$/g, "Innate Talent (Brace)");
            text = text.replace(/^SUPERIOR$/g, "Quality (Superior)");
            text = text.replace(/^DIFFSUBLONGEXT$/g, "Decrease the difficulty of combat checks at long and extreme range by 1");
            text = text.replace(/^ADVADDINIT$/g, "Add [AD] to Initiative Check");
            text = text.replace(/^QUICKST$/g, "Innate Talent (Quick Strike)");
            text = text.replace(/^REMQUALLIMITEDAMMO$/g, "Removes the Limited Ammo Quality");
            text = text.replace(/^STUNDAMAGE$/g, "Quality (Stun Damage)");
            text = text.replace(/^ENCSUB2$/g, "Decrease Encumbrance by");
            text = text.replace(/^MELEEDEFADD$/g, "Increases Melee Defense value by 1");
            text = text.replace(/^RANGEDEFADD$/g, "Increases Ranged Defense value by 1");
            text = text.replace(/^QUALADVSUB$/g, "Quality Takes 1 Less [AD] to Activate");
            text = text.replace(/^MASSHAD$/g, "Innate Talent (Master of Shadows)");
            text = text.replace(/^STEAL$/g, "Skill (Stealth)");
            text = text.replace(/^USERANGLT$/g, "Weapon's skill changes to Ranged-Light");
            text = text.replace(/^RANGEREDMED$/g, "Reduces weapon's range to Medium, if longer");
            text = text.replace(/^LETHALBL$/g, "Innate Talent (Lethal Blows)");
            text = text.replace(/^RESDOSE$/g, "Increase doses by 1");
            text = text.replace(/^DEFLECTION$/g, "Quality (Deflection 1)");
            text = text.replace(/^PRESSHOT$/g, "Innate Talent (Prescient Shot)");
            text = text.replace(/^HPADD$/g, "Add One Hard Point to Item");
            text = text.replace(/^HPSUB$/g, "Remove One Hard Point from Item");
            text = text.replace(/^THRCANCEL$/g, "Cancel [TH] from Check");
            text = text.replace(/^HOLSTER3$/g, "Holster Weapon up to Encumbrance 3");
            text = text.replace(/^ENCTADD3$/g, "Increase Encumbrance Threshold by 3");
            text = text.replace(/^PLANMAP$/g, "Innate Talent (Planet Mapper)");
            text = text.replace(/^STALK$/g, "Innate Talent (Stalker)");
            text = text.replace(/^TECHAPT$/g, "Innate Talent (Technical Apti");
            text = text.replace(/^SUBQUALCUMBERSOME$/g, "Decrease the Cumbersome Quality by 1");
            text = text.replace(/^BAR$/g, "Innate Talent (Barrage)");
            text = text.replace(/^REFLECT$/g, "Innate Talent (Reflect)");
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
                name: '@sourceName'
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
                            if (items[i].Type == 'Vehicle') {
                                continue;
                            }
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
                                    sources.push({'Book': items[i].Sources.Source.Book});
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