function buildInitialPageElements(){
    var protein_data = jQuery.parseJSON(JSON.stringify(protein_types));
    var stock_strength_data = jQuery.parseJSON(JSON.stringify(stock_strengths));
    buildProteinList(protein_data);
    buildStrengthList(stock_strength_data);
    var selected_protein_object = getProteinObject(protein_data, $("#selStockType").val());
    var weight_bones = getAdjustedBonesWeight($("#txtWeightOfBones").val());
    buildStepList(selected_protein_object, weight_bones);
    setInputLabel();
}

function buildNoteItem(step_object){
    var notes_applied=[];
    if (step_object.hasOwnProperty('notes')) {
        for (var note_key in step_object.notes) {
            $('#masterNoteList').append('<li class="ui-li ui-li-static ui-btn-up-c">' + step_object.notes[note_key] + "</li>");
            notes_applied.push($('#masterNoteList li').length);
        }
    }
    return notes_applied;
}

function buildProteinList(protein_data){
    $(protein_data).each(function() {
        $('#selStockType').append($("<option/>", {value: this.id ,text: this.name}));
    });
}

function buildStepList(selected_protein_object, weight_bones){
    $('#masterStepList').empty();
    $('#masterNoteList').empty();
    for (var step_key in selected_protein_object.steps) {
        if (selected_protein_object.steps.hasOwnProperty(step_key)) {
            var notes_applied = buildNoteItem(selected_protein_object.steps[step_key]);
            var cur_step_string = buildStepString(selected_protein_object.steps[step_key], weight_bones);
            if (cur_step_string) {
                var string_to_write = cur_step_string;
                if (notes_applied.length > 0) {
                    string_to_write = string_to_write + '<sup>' + notes_applied.join() + '</sup>';
                }
                $('#masterStepList').append("<li>" + string_to_write + "</li>");
            }
        }
    }
}

function buildStepString(step_object, weight_bones) {
    if (step_object.hasOwnProperty('ingredients')) {
        for (var ingredient_key in step_object.ingredients) {
            var ingredient_step_regex = new RegExp("[{]" + ingredient_key + "[}]", "g");
            if (step_object.ingredients[ingredient_key].hasOwnProperty('immune_strength')) {
                var weight_bones_use = weight_bones / parseFloat($("#selStockStrength").val());
            } else {
                var weight_bones_use = weight_bones;
            }
            step_object.text = step_object.text.replace(ingredient_step_regex, parseFloat(parseFloat(step_object.ingredients[ingredient_key].value) * parseFloat(weight_bones_use)).toFixed(step_object.ingredients[ingredient_key].number_decimal) );
        }
        return step_object.text
    } else {
        return step_object.text;
    }
}

function buildStrengthList(stock_strength_data){
    $('#selStockStrength').empty();
    $(stock_strength_data).each(function() {
        $("#selStockStrength").append($("<option/>", {value: this.modifier, text: this.label}));
    });
}

function getAdjustedBonesWeight() {
    return parseFloat( parseFloat($("#txtWeightOfBones").val()) *  parseFloat($("#selStockStrength").val()));
}

function getProteinObject(protein_data, protein_id) {
    for (var protein_key in protein_data) {
        if (protein_data.hasOwnProperty(protein_key)) {
            if (protein_data[protein_key].id == protein_id) {
                return protein_data[protein_key];
            }
        }
    }
    return false;
}

function setInputLabel() {
	if ($("#selStockType").val() == 'vegetable') {
		$("#lblWeightOfBones").text('Amount of Stock (mL) :');
		$("#lblTitleWeightOfBones").text('Amount of Stock :');
	} else {
		$("#lblWeightOfBones").text('Weight of Bones (g) :');
		$("#lblTitleWeightOfBones").text('Weight of Bones :');
	}
}
