import matplotlib.pyplot as plt
import json
from pyscript import document, display

def draw_grpah(event):
    data1 = document.querySelector('div#exp-summary-chart').getAttribute('data1')
    data2 = document.querySelector('div#exp-summary-chart').getAttribute('data2')
    data1_dict =  json.loads(data1)
    data1_x = data1_dict.keys()
    data1_y = data1_dict.values()
    data2_dict =  json.loads(data2)
    data2_x = data2_dict.keys()
    data2_y = data2_dict.values()

    fig, ax = plt.subplots(figsize=(5, 2.7), layout='constrained')
    ax.plot(data1_x, data1_y, label="Income")  # Plot some data on the Axes.
    ax.plot(data2_x, data2_y, label="Expense")  # Plot some data on the Axes.
    ax.set_xlabel('Date')
    ax.set_ylabel('Amount')
    ax.set_title('Income vs Expense')
    # ax.set_xticklabels(ax.get_xticklabels(), rotation = 50)
    ax.tick_params(axis='x', labelrotation = 50)
    
    plt.legend()
    # plt.show()    
    display(fig)
