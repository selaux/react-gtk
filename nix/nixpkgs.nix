let
    host_pkgs = import <nixpkgs> {};
    src = host_pkgs.fetchFromGitHub {
        owner = "NixOS";
        repo = "nixpkgs-channels";
        rev = "45a419ab5a23c93421c18f3d9cde015ded22e712";
        sha256 = "00mpq5p351xsk0p682xjggw17qgd079i45yj0aa6awawpckfx37s";
    };
in
{
    inherit src;
    import = import src;
}
