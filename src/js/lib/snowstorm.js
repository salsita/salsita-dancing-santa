(function($){
  var win,
  canvas,
  ctx,
  circle = Math.PI * 2,
  snowflakes = [],
  max_snowflakes = 250,
  min_snowflake_radius = 1,
  max_snowflake_radius = 5,
  snowflake_max_velocity = 3,
  gravity = new Vector(0,0.03),
  wind_speed = 0.125,
  wind_max_speed = 0.1,
  wind_entropy = 0.125,
  wind = new Vector((Math.random() - 0.5) * wind_speed, 0);

  function Vector(x,y)
  {
    this.x = x;
    this.y = y;
  }

  function Snowflake(size)
  {
    this.position = new Vector(0,0);
    this.velocity = new Vector(0,0);
    this.size = size;
    this.color = "rgba(255,255,255," + (max_snowflake_radius - this.size) +")";
  }

  function render()
  {
    var i, l = snowflakes.length, flake, min_x = canvas.width * -0.25, max_x = canvas.width * 1.25;

    canvas.width = canvas.width;
    for(i=0; i<l; i++)
    {
      flake = snowflakes[i];
      var half_size = flake.size * 0.5;
      flake.velocity.x = Math.min(snowflake_max_velocity, flake.velocity.x + gravity.x + wind.x + ((Math.random() - 0.5) * wind_entropy));
      flake.velocity.y = Math.min(snowflake_max_velocity, flake.velocity.y + gravity.y + wind.y + ((Math.random() - 0.5) * wind_entropy));

      flake.position.x += half_size * flake.velocity.x;
      flake.position.y += half_size * flake.velocity.y;

      if((flake.position.y < window.innerHeight) && (flake.position.x > min_x) && (flake.position.x < max_x))
      {
        if((flake.position.x > 0) && (flake.position.x < canvas.width) && (flake.position.y > 0))
        {
          ctx.fillStyle = flake.color;
          ctx.beginPath();
          ctx.arc(flake.position.x, flake.position.y, flake.size, 0, circle);
          ctx.closePath();
          ctx.fill();
        }
      }
      else
      {
        flake.position.x = (Math.random() * canvas.width * 3) - canvas.width;
        if(flake.position.x < 0 || flake.position.x > canvas.width)
        {
          flake.position.y = Math.random() * canvas.height;
        }
        else
        {
          flake.position.y = Math.random() * -100;
        }
        flake.velocity = new Vector(0,0);
      }
    }

    wind.x += (Math.random() - 0.5) * wind_entropy * 0.125;
    wind.x = Math.min(wind_max_speed, wind.x);

    requestAnimationFrame(render);
  }

  function add_new_snowflake()
  {
    var w = canvas.width;
    var h = canvas.height;
    var size = Math.random() * (max_snowflake_radius - min_snowflake_radius) + min_snowflake_radius;
    var snowflake = new Snowflake(size);

    snowflake.position = new Vector((Math.random() * w * 3) - w, Math.random() * h);
    return snowflake;
  }

  function on_document_ready()
  {
    win = $(window);
    canvas = document.getElementById("snowfield");
    ctx = canvas.getContext("2d");
    win.on('resize', resize).trigger('resize');

    for(var n=0; n<max_snowflakes; n++)
    {
      var snowflake = add_new_snowflake();
      snowflakes.push(snowflake);
    }

    requestAnimationFrame(render);
  }

  function resize()
  {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
  }

  $(on_document_ready);
})(jQuery)
