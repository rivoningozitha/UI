// import Chart from 'chart.js/auto';


$(function () {
    "use strict";
Morris.Bar({
  element: 'bar-chart', // must match the ID above
  data: [
    { location: "Area 1", value: 5 },
    { location: "Area 2", value: 10 },
    { location: "Area 3", value: 11 },
    { location: "Area 4", value: 14 },
    { location: "Area 9", value: 10 },
    { location: "Area 10", value: 10 },
    { location: "Area 11", value: 15 },
    { location: "Area 12", value: 5 },
    { location: "Area 14", value: 20 }
  ],
  xkey: 'location',
  ykeys: ['value'],
  labels: ['Num of reported issues'],
  barColors: ['#f26522']
});


Morris.Donut({
    element: 'morris-donut-chart',
    data: 
    [{
        label: "Tanks",
        value: 120,

    }, 
    {
        label: "Sensors",
        value: 140,

    }, 
    {
        label: "Pipes",
        value: 170,

    }, 
    {
        label: "Control Unit",
        value: 110,

    }, 
    {
        label: "Software",
        value: 130
    }, 
],
    resize: true,
    colors: ['#f26522', '#205781', '#FFAB5B' ,'#81E7AF', '#9FB3DF'],
    formatter: function(y){
        return 'R' + y.toLocaleString() + 'k';
    }
});



Morris.Bar({
    element: 'bar-chart2', // must match the ID above
    data: [
      { facility: "Library", value: 250000 },
      { facility: "Operations Dpt", value: 100000 },
      { facility: "Lecture Halls", value: 260000 },
      { facility: "Water Fountain", value: 190000 },
      { facility: "Student Centre", value: 180000 },
      { facility: "Agriculture", value: 100000 },
      { facility: "Female Residences", value: 190000 },
      { facility: "Male Residences", value: 150000 },
      { facility: "Other", value: 20000 }
    ],
    xkey: 'facility',
    ykeys: ['value'],
    labels: ['Water usage per area'],
    hoverCallback: function (index, options, content, row) {
        // Modify the content by appending 'L' to the value
        content = content.replace(row.value, row.value + ' L');
        return content; // return modified content with 'L'
      }
  });

})





// delete a sensor card

document.addEventListener('click', function (event) {
    const card = event.target.closest('.card');
    if (card && card.parentNode) {
        // Remove selection from previous
        if (selectedCard) selectedCard.classList.remove('selected');

        // Select new card
        selectedCard = card;
        selectedCard.classList.add('selected');
    }
});

document.getElementById('deleteBtnSensors').addEventListener('click', function () {
    if (selectedCard) {
        selectedCard.remove();
        selectedCard = null;
        document.querySelector('#sensorSection').scrollTo({ left: 0, behavior: 'smooth' });
    }
    else{
        alert('Please first select a card to delete.')
    }

});



// delete a tank card
let selectedCard = null;

document.addEventListener('click', function (event) {
    const card = event.target.closest('.card');
    if (card && card.parentNode) {
        // Remove selection from previous
        if (selectedCard) selectedCard.classList.remove('selected');

        // Select new card
        selectedCard = card;
        selectedCard.classList.add('selected');
    }
});

document.getElementById('deleteBtnTanks').addEventListener('click', function () {
    if (selectedCard) {
        selectedCard.remove();
        selectedCard = null;
        document.querySelector('.scroll-container').scrollTo({ left: 0, behavior: 'smooth' });
    }
    else{
        alert('Please first select a card to delete.')
    }

});



// delete a pipe card
document.addEventListener('click', function (event) {
    const card = event.target.closest('.card');
    if (card && card.parentNode) {
        // Remove selection from previous
        if (selectedCard) selectedCard.classList.remove('selected');

        // Select new card
        selectedCard = card;
        selectedCard.classList.add('selected');
    }
});

document.getElementById('deleteBtnPipes').addEventListener('click', function () {
    if (selectedCard) {
        selectedCard.remove();
        selectedCard = null;
        document.querySelector('#pipeSection').scrollTo({ left: 0, behavior: 'smooth' });
    }
    else{
        alert('Please first select a card to delete.')
    }

});




// Add tank card
document.getElementById('tankForm').addEventListener('click', function () {
    const card = document.getElementById('tankCard');

    if (card.style.display === 'none' || card.style.display === '') {
        card.style.display = 'block';

        // Delay scrolling 
        setTimeout(() => {
            card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }, 100);
    } else {
        card.style.display = 'none';
    }
});


//Add pipe card

document.getElementById('pipeForm').addEventListener('click', function () {
    const card = document.getElementById('pipeCard');

    if (card.style.display === 'none' || card.style.display === '') {
        card.style.display = 'block';

        // Delay scrolling 
        setTimeout(() => {
            card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }, 100);
    } else {
        card.style.display = 'none';
    }
});


//Add sensor card

document.getElementById('sensorForm').addEventListener('click', function () {
    const card = document.getElementById('sensorCard');

    if (card.style.display === 'none' || card.style.display === '') {
        card.style.display = 'block';

        // Delay scrolling 
        setTimeout(() => {
            card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }, 100);
    } else {
        card.style.display = 'none';
    }
});




