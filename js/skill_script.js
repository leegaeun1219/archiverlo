(function () {

  function startSkillAnimation() {

    // 숫자 올라가는 애니메이션 → 1700ms
    $('.skill-box').find('b').each(function () {
      $(this)
        .prop('Counter', 0)
        .animate(
          { Counter: $(this).parent().data('percent') },
          {
            duration: 1700,       // ← 천천히!
            easing: 'swing',
            step: function (now) {
              $(this).text(Math.ceil(now) + '%');
            }
          }
        );
    });

    // 원형 채워지는 애니메이션 → 전체 1700ms로 통일
    $('.skill-box .skills-circle li').each(function () {
      var right = $(this).find('.bar-circle-right');
      var left = $(this).find('.bar-circle-left');
      var percent = $(this).data('percent');
      var deg = 3.6 * percent;

      if (percent <= 50) {
        // 오른쪽 반원만 회전
        right.animate(
          { circle_rotate: deg },
          {
            step: function (deg) {
              $(this).css('transform', 'rotate(' + deg + 'deg)');
            },
            duration: 1700,  // ← 속도 조절
            easing: 'linear'
          }
        );
      } else {
        // 50% 넘으면 오른쪽 먼저 180도
        right.animate(
          { circle_rotate: 180 },
          {
            step: function (deg) {
              $(this).css('transform', 'rotate(' + deg + 'deg)');
            },
            duration: 850, // 1700ms의 절반
            easing: 'linear',
            complete: function () {

              var remainDeg = deg - 180;

              left.css({
                clip: 'rect(0, 150px, 150px, 75px)',
                background: 'rgb(102, 155, 229)'
              });

              left.animate(
                { circle_rotate: remainDeg },
                {
                  step: function (deg) {
                    $(this).css('transform', 'rotate(' + deg + 'deg)');
                  },
                  duration: 850, // 나머지 절반
                  easing: 'linear'
                }
              );

            }
          }
        );
      }
    });

  }


  // Observer (섹션에 들어오면 1번만 실행)
  $(document).ready(function () {
    var target = document.getElementById('skills');
    if (!target) return startSkillAnimation();

    var played = false;

    new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !played) {
          played = true;
          startSkillAnimation();
        }
      });
    }, { threshold: 0.3 }).observe(target);
  });

})();
