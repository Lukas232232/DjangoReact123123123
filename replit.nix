{ pkgs }: {
  deps = [
    pkgs.run
    pkgs.nodejs
    pkgs.nodejs-12_x
    pkgs.nodejs-16_x
    pkgs.python38Full
  ];
  env = {
    PYTHONBIN = "${pkgs.python38Full}/bin/python3.8";
    LANG = "en_US.UTF-8";
  };
}