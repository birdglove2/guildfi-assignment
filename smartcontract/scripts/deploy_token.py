from brownie import GEM, config, network
from scripts.helpful_scripts import get_account
from web3 import Web3


INITIAL_SUPPLY = Web3.toWei(10**6, "ether")


def deploy_gem(account=None):
    account = get_account()
    gem = GEM.deploy(
        INITIAL_SUPPLY,
        {"from": account},
        publish_source=config["networks"][network.show_active()].get("verify", False),
    )
    print("Token name: ", gem.name())
    print("deploy at ", gem.address)


def main():
    deploy_gem()
