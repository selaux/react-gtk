let
    host_pkgs = import <nixpkgs> {};
    src = host_pkgs.fetchFromGitHub {
        owner = "NixOS";
        repo = "nixpkgs-channels";
        rev = "310ad4345bbe42ae7360981243f6602a03fd232f";
        sha256 = "1svfr9w0c349r72nwpcl81dr46wh1qii8ad6pygkgslqhwmsp520";
    };
in
{
    inherit src;
    import = import src;
}
