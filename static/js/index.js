$(document).ready(function() {
    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(function() {
      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      $(".navbar-burger").toggleClass("is-active");
      $(".navbar-menu").toggleClass("is-active");

    });

    var options = {
			slidesToScroll: 1,
			slidesToShow: 3,
			loop: true,
			infinite: true,
			autoplay: false,
			autoplaySpeed: 3000,
    }

    // Special options for lamps carousel - show only 1 slide
    var lampsOptions = {
			slidesToScroll: 1,
			slidesToShow: 1,
			loop: true,
			infinite: true,
			autoplay: false,
			autoplaySpeed: 3000,
    }

		// Initialize lamps carousel with single slide view
    var lampsCarousel = bulmaCarousel.attach('#lamps-carousel', lampsOptions);

		// Initialize other carousels with default options
    var carousels = bulmaCarousel.attach('.carousel:not(#lamps-carousel)', options);

    // Loop on each carousel initialized
    for(var i = 0; i < carousels.length; i++) {
    	// Add listener to  event
    	carousels[i].on('before:show', state => {
    		console.log(state);
    	});
    }

    // Access to bulmaCarousel instance of an element
    var element = document.querySelector('#my-element');
    if (element && element.bulmaCarousel) {
    	// bulmaCarousel instance is available as element.bulmaCarousel
    	element.bulmaCarousel.on('before-show', function(state) {
    		console.log(state);
    	});
    }

    bulmaSlider.attach();

    // Auto-rotate lamp images
    function rotateLampImages() {
        $('.lamp-image-container').each(function() {
            var $container = $(this);
            var $images = $container.find('.lamp-photo');
            var currentIndex = 0;

            setInterval(function() {
                // Remove active class from current image
                $images.eq(currentIndex).removeClass('active');

                // Move to next image
                currentIndex = (currentIndex + 1) % $images.length;

                // Add active class to next image
                $images.eq(currentIndex).addClass('active');
            }, 2000); // Change image every 2 seconds
        });
    }

    // Start rotating lamp images
    rotateLampImages();

    // Add metallic finish to 3D models
    function addMetallicFinish() {
        const modelViewers = document.querySelectorAll('model-viewer');

        modelViewers.forEach((modelViewer) => {
            modelViewer.addEventListener('load', () => {
                const materials = modelViewer.model.materials;

                materials.forEach((material) => {
                    // Set metallic properties for a nice metallic finish
                    // Metalness: 0.8 (high value for metallic appearance)
                    // Roughness: 0.3 (lower value for shinier surface)
                    material.pbrMetallicRoughness.setMetallicFactor(0.8);
                    material.pbrMetallicRoughness.setRoughnessFactor(0.5);
                });
            });
        });
    }

    // Apply metallic finish to all model viewers
    addMetallicFinish();

    // Auto-rotate single-view RGB rendered images with click control
    function rotateSingleViewRGBs() {
        console.log('Setting up single-view RGB rotation');

        $('.singleview-rgb-container').each(function() {
            var $container = $(this);
            var caseId = $container.data('case');
            var numImages = 6;
            var basePath = './static/images/singleview_' + caseId + '_rgbs/';
            var $prevBtn = $container.find('.rgb-carousel-prev');
            var $nextBtn = $container.find('.rgb-carousel-next');
            var currentIndex = 0;
            var intervalId = null;
            var $currentImg = null;

            console.log('Setting up RGB carousel for ' + caseId);

            // Create a single image element that we'll update
            $currentImg = $('<img>')
                .addClass('singleview-rgb')
                .css({
                    'border-radius': '8px',
                    'position': 'absolute',
                    'top': '0',
                    'left': '0',
                    'width': '100%',
                    'height': '100%',
                    'object-fit': 'contain'
                });

            // Insert before buttons
            $prevBtn.before($currentImg);

            // Function to show specific image
            function showImage(index) {
                console.log('Showing RGB image ' + index + ' for ' + caseId);
                var imgPath = basePath + 'image' + index + '.png';
                $currentImg.attr('src', imgPath);
                currentIndex = index;
            }

            // Auto-rotate function
            function startAutoRotate() {
                console.log('Starting auto-rotate for ' + caseId);
                if (intervalId) clearInterval(intervalId);
                intervalId = setInterval(function() {
                    var nextIndex = (currentIndex + 1) % numImages;
                    showImage(nextIndex);
                }, 1500); // Change image every 1.5 second
            }

            // Previous button click
            $prevBtn.on('click', function(e) {
                e.stopPropagation(); // Prevent container click
                console.log('Previous button clicked');
                if (intervalId) clearInterval(intervalId);

                var prevIndex = (currentIndex - 1 + numImages) % numImages;
                showImage(prevIndex);

                setTimeout(function() {
                    startAutoRotate();
                }, 5000);
            });

            // Next button click
            $nextBtn.on('click', function(e) {
                e.stopPropagation(); // Prevent container click
                console.log('Next button clicked');
                if (intervalId) clearInterval(intervalId);

                var nextIndex = (currentIndex + 1) % numImages;
                showImage(nextIndex);

                setTimeout(function() {
                    startAutoRotate();
                }, 5000);
            });

            // Add hover effects to buttons
            $container.find('.rgb-carousel-btn').hover(
                function() {
                    $(this).css('background-color', 'rgba(211, 211, 211, 0.9)');
                },
                function() {
                    $(this).css('background-color', 'rgba(211, 211, 211, 0.7)');
                }
            );

            // Click container to advance
            $container.on('click', function(e) {
                // Don't trigger if clicking on buttons
                if ($(e.target).closest('.rgb-carousel-btn').length) return;

                console.log('Container clicked for ' + caseId);
                if (intervalId) clearInterval(intervalId);

                var nextIndex = (currentIndex + 1) % numImages;
                showImage(nextIndex);

                setTimeout(function() {
                    startAutoRotate();
                }, 5000);
            });

            // Make cursor pointer to indicate clickable
            $container.css('cursor', 'pointer');

            // Initialize with first image
            showImage(0);

            // Start auto-rotation
            startAutoRotate();
        });
    }

    // Start rotating single-view RGB images
    rotateSingleViewRGBs();

    // Auto-rotate multi-view input images
    function rotateMultiViewInputs() {
        console.log('Setting up multi-view input carousels');

        $('.multiview-input-carousel').each(function() {
            var $container = $(this);
            var caseId = $container.data('case');
            var numImages = 300;
            var basePath = './static/images/multiview_' + caseId + '_inputs/';
            var currentIndex = 0;
            var intervalId = null;
            var $prevBtn = $container.find('.multiview-carousel-prev');
            var $nextBtn = $container.find('.multiview-carousel-next');
            var $currentImg = null;

            console.log('Setting up carousel for ' + caseId);

            // Create a single image element that we'll update
            $currentImg = $('<img>')
                .addClass('multiview-input-img')
                .css({
                    'border-radius': '8px',
                    'position': 'absolute',
                    'top': '0',
                    'left': '0',
                    'width': '100%',
                    'height': '100%',
                    'object-fit': 'contain'
                });

            // Insert before buttons
            $prevBtn.before($currentImg);

            // Function to show specific image
            function showImage(index) {
                var imgPath = basePath + String(index).padStart(4, '0') + '.png';
                $currentImg.attr('src', imgPath);
                currentIndex = index;
            }

            // Auto-rotate function
            function startAutoRotate() {
                console.log('Starting auto-rotate for ' + caseId);
                if (intervalId) clearInterval(intervalId);
                intervalId = setInterval(function() {
                    var nextIndex = (currentIndex + 1) % numImages;
                    showImage(nextIndex);
                }, 1000); // Change image every 1000ms
            }

            // Previous button click
            $prevBtn.on('click', function(e) {
                e.stopPropagation();
                console.log('Previous button clicked for ' + caseId);
                if (intervalId) clearInterval(intervalId);

                var prevIndex = (currentIndex - 1 + numImages) % numImages;
                showImage(prevIndex);

                setTimeout(function() {
                    startAutoRotate();
                }, 5000);
            });

            // Next button click
            $nextBtn.on('click', function(e) {
                e.stopPropagation();
                console.log('Next button clicked for ' + caseId);
                if (intervalId) clearInterval(intervalId);

                var nextIndex = (currentIndex + 1) % numImages;
                showImage(nextIndex);

                setTimeout(function() {
                    startAutoRotate();
                }, 5000);
            });

            // Add hover effects to buttons
            $container.find('.multiview-carousel-btn').hover(
                function() {
                    $(this).css('background-color', 'rgba(211, 211, 211, 0.9)');
                },
                function() {
                    $(this).css('background-color', 'rgba(211, 211, 211, 0.7)');
                }
            );

            // Click container to advance
            $container.on('click', function(e) {
                // Don't trigger if clicking on buttons
                if ($(e.target).closest('.multiview-carousel-btn').length) return;

                console.log('Container clicked for ' + caseId);
                if (intervalId) clearInterval(intervalId);

                var nextIndex = (currentIndex + 1) % numImages;
                showImage(nextIndex);

                setTimeout(function() {
                    startAutoRotate();
                }, 5000);
            });

            // Make cursor pointer to indicate clickable
            $container.css('cursor', 'pointer');

            // Initialize with first image
            showImage(0);

            // Start auto-rotation
            startAutoRotate();
        });
    }

    // Start rotating multi-view input images
    rotateMultiViewInputs();

})
