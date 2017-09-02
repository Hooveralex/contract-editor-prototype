loadTinyMCE();
updateLabels();
updateOutline();

var $active_clause = null;
var $publish_pending = false;
var $draft_pending = false;

var newOptions = '<a class="create-new-clause" href="#new-clause" data-toggle="modal" data-target="#createClause">Create New Clause</a> | ' +
'<a class="sync-library" href="#sync-library" data-toggle="modal" data-target="#openLibrary">Sync with Clause Library</a>';

// TinyMCE inits for clause blocks in the contract editor, clause editors in clause editing forms, and guidance editing forms for 
// inputs related to Description, Discussion.
function loadTinyMCE() {
    tinymce.init({ 
    	selector:'.clause',
        plugins: 'table contractstandards',
        browser_spellcheck: true,
    	menubar: false,
    	statusbar: false,
    	inline: true,
    	toolbar: 'undo redo | bold italic underline | outline promote demote | table popup'
    });

    tinymce.init({ 
        selector:'.clause-editor',
        plugins: 'table contractstandards',
        content_css: 'assets/css/numbering.css',
        browser_spellcheck: true,
        menubar: false,
        statusbar: false,
        toolbar: 'undo redo | bold italic underline | outline promote demote | table popup'
    });

    tinymce.init({ 
        selector:'.guidance-editor',
        browser_spellcheck: true,
        plugins:'table lists link contractstandards',
        browser_spellcheck: true,
        menubar: false,
        statusbar: false,
        style_formats: [
            { title: 'Section Heading', block: 'h3' },
            { title: 'Section Sub-heading', block: 'h4', styles: {'font-weight': '400', 'line-height': '1', 'color': '#777'} }
          ],
        toolbar: 'undo redo | bold italic underline | styleselect bullist | link table popup'
    });
}


function get_offset(active_clause){
    return active_clause.offset().top;
}

// The following toggle functions are run every time a user click on a div.clause. See line 129 
// Controls the "changes pending" badge in the clause controls
function togglePending(){
    if ($active_clause.hasClass('clause-saved')){
        $('.changes-pending').addClass('hidden');
    } else {
        $('.changes-pending').removeClass('hidden');
    }
}

// Controls "Advanced" link clause controls
function toggleAdvanced(){
    if ($active_clause.hasClass('clause')){
        $('.clause-advanced').closest('li').removeClass('disabled');
    } else {
        $('.clause-advanced').closest('li').addClass('disabled');
    }
}

// Controls "Save Draft" and "Publish" links in clause controls
function toggleSaved(){
    if ($active_clause.hasClass('clause-saved') && $active_clause.hasClass('clause-draft')){
        $('.save-clause-draft').closest('li').addClass('disabled');
        $('.save-clause-publish').closest('li').removeClass('disabled');
    } else if ($active_clause.hasClass('clause-saved')){
        $('.save-clause-draft, .save-clause-publish').closest('li').addClass('disabled');
    } else {
        $('.save-clause-draft, .save-clause-publish').closest('li').removeClass('disabled');
    }
}

// Basic function to switch saved clause status from unsaved to saved
function clauseSaved(){
    $active_clause.removeClass('clause-unsaved');
    $active_clause.addClass('clause-saved');
}

// Closes all modals when fired
function closeModal(){
    $('.modal').modal('hide');
}

// Fired when div.clause is clicked on. Updates classes of label based on clause status
function updateLabels(){
    $('.clause-label-unsynced, .clause-label-draft').removeClass('clause-label-unsynced').removeClass('clause-label-draft');

    $('.clause-unsynced').prev('.clause-label').addClass('clause-label-unsynced');
    $('.clause-draft').prev('.clause-label').addClass('clause-label-draft');
}

// Fired when div.clause is clicked on. Updates classes of outline-items based on clause status
function updateOutline(){
    $('.outline-item').removeClass('outline-item-unsynced').removeClass('outline-item-unsaved').removeClass('outline-item-draft');

    $('.clause-unsynced').each(function(){
        var id = $(this).attr('id');
        $('#outline [data-clause="' + id + '"]').addClass('outline-item-unsynced');
    });

    $('.clause-unsaved').each(function(){
        var id = $(this).attr('id');
        $('#outline [data-clause="' + id + '"]').addClass('outline-item-unsaved');
    });

    $('.clause-draft').each(function(){
        var id = $(this).attr('id');
        $('#outline [data-clause="' + id + '"]').addClass('outline-item-draft');
    });
}

// hide controls. fired at various times
function hideControls(){
    $('.clause-controls').addClass('hidden');
}

// changes clause classes based on draft to publish status
function clausePublished(){
    $active_clause.removeClass('clause-draft');
    $active_clause.prev('.clause-label').removeClass('.clause-label-draft');
}

// When .clause is clicked
$('#editor').on('click', '.clause', function(){
    $active_clause = $(this);
    $('.clause-controls').removeClass('hidden');
    var offset = $(this).offset().top;
    $('.clause-controls').css('top', offset - 66);
    togglePending();
    toggleAdvanced();
    toggleSaved();
});

// Hide clause controls when user clicks on unsynced clause
$('#editor').on('click', '.clause-unsynced', function(){
    hideControls();
});

// Hide clause controls when user moves their mouse over the outline. Also updates outline items to ensure that they are properly synced with clause classes
$('#outline').on('mouseenter', function(){
    hideControls();
    updateOutline();
});

// Scrolling when user clicks on outline-item
$('#outline').on('click', '.outline-item', function(e){
    var id = $(this).attr('data-clause');
    var offset = $('#' + id).offset().top;
    $('body').animate({scrollTop: offset - 88}, '500');
});

// Populate unsynced clauses with the new clause and sync with library options
$('.clause-unsynced').html(newOptions);

// Close all modals when you click a create new alt button
$('body').on('click', '.create-new-alt', function(e){
    closeModal();
});

// In the saveWarning modal, there is a "save" button that let a user save their changes.
// On clicking that save button, the code checks the status of two variables. It wants to see if the user intended to save the clauses as a draft or published clause
// The code then fires various functions that close modals, toggle the clause status, and clause-controls
$('body').on('click', '.confirm-save', function(e){
    if($publish_pending){
        $active_clause.removeClass('clause-draft');
        $publish_pending = false;
    }

    if($draft_pending){
        $active_clause.addClass('clause-draft');
        $draft_pending = false;
    }

    closeModal();
    clauseSaved();
    toggleSaved();
    togglePending();
    updateLabels();
    updateOutline();
});

// Clause modal on cancelling a save or clicking the "Sync" option in the clause library
$('body').on('click', '.cancel-save, .sync-clause', function(e){
    closeModal();
});

// When a user starts typing the containing div.clause is updated
$('#editor').on('keyup', '.clause', function(){
    $active_clause.removeClass('clause-saved');
    $active_clause.addClass('clause-unsaved');
    updateOutline();
    togglePending();
    toggleSaved();
});

// Lines 210 - 263 are mostly used to simulate interactions with the database.
$('.confirm-new-clause-publish').on('click', function(){
    var text = tinymce.get('new-clause-text').getContent();
    closeModal();
    console.log(tinymce.get('new-clause-text').getContent());
    $active_clause.removeClass('clause-unsynced');
    $active_clause.addClass('clause clause-saved');
    $active_clause.html(text);
    loadTinyMCE();
    togglePending();
    toggleSaved();
    updateLabels();
    updateOutline();
});

$('.confirm-new-clause-draft').on('click', function(){
    var text = tinymce.get('new-clause-text').getContent();
    closeModal();
    $active_clause.removeClass('clause-unsynced');
    $active_clause.addClass('clause clause-saved');
    $active_clause.addClass('clause-draft');
    $active_clause.html(text);
    loadTinyMCE();
    togglePending();
    toggleSaved();
    updateLabels();
    updateOutline();
});

$('.confirm-new-alternative-publish').on('click', function(){
    var text = tinymce.get('new-alternative-text').getContent();
    closeModal();
    $active_clause.removeClass('clause-unsynced');
    $active_clause.addClass('clause clause-saved');
    $active_clause.html(text);
    loadTinyMCE();
    togglePending();
    toggleSaved();
    updateLabels();
    updateOutline();
});

$('.confirm-new-alternative-draft').on('click', function(){
    var text = tinymce.get('new-alternative-text').getContent();
    closeModal();
    $active_clause.removeClass('clause-unsynced');
    $active_clause.addClass('clause clause-saved');
    $active_clause.addClass('clause-draft');
    $active_clause.html(text);
    loadTinyMCE();
    togglePending();
    toggleSaved();
    updateLabels();
    updateOutline();
});

// Designates active clause when user clicks on links in .clause-unsynced
$('#editor').on('click', '.create-new-clause, .sync-library', function(){
    $active_clause = $(this).closest('.clause-unsynced');
});

// On clicking "Publish" in clause-controls, update publish_pending variable. Useful in function on line 176
$('.save-clause-publish').on('click', function(){
    $publish_pending = true;
});

// On clicking "Save as Draft" in clause-controls, update draft_pending variable. Useful in function on line 176
$('.save-clause-draft').on('click', function(){
    $draft_pending = true;
});