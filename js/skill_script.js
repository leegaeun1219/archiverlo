(function () {

  // ✅ 1. 스킬 애니메이션만 하는 함수로 분리
  function startSkillAnimation() {
    // 숫자 0% -> n% 올라가는 부분
    $('.skill-box').find('b').each(function (i) {
      $(this)
        .prop('Counter', 0)
        .animate(
          { Counter: $(this).parent().data('percent') },
          {
            duration: 1000,
            easing: 'swing',
            step: function (now) {
              $(this).text(Math.ceil(now) + '%');
            }
          }
        );
    });

    // 동그라미(원 그래프) 채워지는 부분
    $('.skill-box .skills-circle li').each(function (i) {
      var _right = $(this).find('.bar-circle-right');
      var _left = $(this).find('.bar-circle-left');
      var _percent = $(this).attr('data-percent');
      var deg = 3.6 * _percent;

      if (_percent <= 50) {
        // 50% 이하: 오른쪽 반원만 회전
        _right.animate(
          { circle_rotate: deg },
          {
            step: function (deg) {
              $(this).css('transform', 'rotate(' + deg + 'deg)');
            },
            duration: 1000
          }
        );
      } else {
        // 50% 초과: 오른쪽 180도까지 → 왼쪽 이어서 회전
        var full_deg = 180;
        deg -= full_deg;
        var run_duration = 1000 * (50 / _percent);

        _right.animate(
          { circle_rotate: full_deg },
          {
            step: function (full_deg) {
              $(this).css('transform', 'rotate(' + full_deg + 'deg)');
            },
            duration: run_duration,
            easing: 'linear',
            complete: function () {
              run_duration -= 1000;

              _left.css({
                clip: 'rect(0, 150px, 150px, 75px)',
                background: 'rgb(102, 155, 229)'
              });

              _left.animate(
                { circle_rotate: deg },
                {
                  step: function (deg) {
                    $(this).css('transform', 'rotate(' + deg + 'deg)');
                  },
                  duration: Math.abs(run_duration),
                  easing: 'linear'
                }
              );
            }
          }
        );
      }
    });
  }

  // ✅ 2. #skills 섹션이 화면에 들어올 때 한 번만 실행
  $(document).ready(function () {
    var skillsSection = document.getElementById('skills');
    if (!skillsSection) {
      // 혹시 섹션이 없으면 그냥 즉시 실행(안전빵)
      startSkillAnimation();
      return;
    }

    var alreadyPlayed = false;

    // IntersectionObserver 사용
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !alreadyPlayed) {
            alreadyPlayed = true;
            startSkillAnimation();
            observer.unobserve(skillsSection);
          }
        });
      },
      {
        threshold: 0.3 // 섹션의 30% 정도 보이면 애니메이션 시작
      }
    );

    observer.observe(skillsSection);
  });

}).call(this);
