{
  description = "Your flake name";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let pkgs = nixpkgs.legacyPackages.${system}; in
      {
        devShells.default =
          pkgs.mkShell {
            buildInputs = with pkgs; [
              nodejs_22
              ffmpeg_7-full
              vulkan-tools
              amdvlk
            ];
          };
      });
}
